// Payment controller handling Stripe checkout session creation and webhook processing
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';
import ApiError from '../../utils/ApiError.js';
import { env } from '../../config/env.js';
import { createPaymentIntent as stripeCreateIntent, constructWebhookEvent } from './payment.service.js';

// @desc    Create Stripe PaymentIntent for a pending booking (User)
// @route   POST /api/payments/create-intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const rawId = req.body?.bookingId || req.body;
  const bookingId = typeof rawId === 'object' ? rawId?.bookingId : rawId;

  if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, 'Valid Booking ID is required');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You can only pay for your own bookings');
  }

  if (booking.paymentStatus === 'paid' || booking.status === 'confirmed') {
    return res.status(200).json({
      success: true,
      alreadyPaid: true,
      message: 'This booking has already been paid and confirmed.',
      data: {
        bookingId: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  }

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Cannot process payment for a cancelled booking');
  }

  // Amount in smallest currency unit (cents)
  const amountInCents = Math.round(booking.totalPrice * 100);

  const intent = await stripeCreateIntent(amountInCents, 'usd', {
    bookingId: booking._id.toString(),
    userId: req.user._id.toString(),
  });

  // Create or update existing pending payment record
  let payment = await Payment.findOne({ booking: booking._id });
  if (payment) {
    payment.stripePaymentIntentId = intent.id;
    payment.amount = amountInCents;
    payment.status = 'pending';
    await payment.save();
  } else {
    payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      stripePaymentIntentId: intent.id,
      amount: amountInCents,
      currency: 'usd',
      status: 'pending',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      clientSecret: intent.client_secret,
      paymentId: payment._id,
    },
  });
});

// @desc    Handle Stripe Webhook events (Stripe Event Dispatcher)
// @route   POST /api/payments/webhook
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && signature) {
      event = constructWebhookEvent(req.body, signature, webhookSecret);
    } else {
      // Fallback if secret not configured in dev
      event = JSON.parse(req.body.toString());
    }
  } catch (error) {
    console.error(`⚠️ Webhook signature verification failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        // Update Payment record
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            status: 'succeeded',
            paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
          }
        );

        // Update Booking status to confirmed & paid
        await Booking.findByIdAndUpdate(bookingId, {
          status: 'confirmed',
          paymentStatus: 'paid',
        });

        console.log(`✅ Payment succeeded & Booking ${bookingId} confirmed!`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'failed' }
      );
      console.log(`❌ Payment failed for intent ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// @desc    Get payment details by Booking ID (User)
// @route   GET /api/payments/booking/:bookingId
export const getPaymentByBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, 'Invalid Booking ID format');
  }

  const payment = await Payment.findOne({ booking: bookingId }).populate('booking');
  if (!payment) {
    throw new ApiError(404, 'Payment record not found for this booking');
  }

  if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You do not have permission to view this payment');
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// @desc    Confirm payment & update booking status to paid and confirmed (Client confirmation)
// @route   POST /api/payments/confirm
export const confirmPayment = asyncHandler(async (req, res) => {
  const rawId = req.body?.bookingId || req.body;
  const bookingId = typeof rawId === 'object' ? rawId?.bookingId : rawId;

  if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, 'Valid Booking ID is required');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  booking.paymentStatus = 'paid';
  booking.status = 'confirmed';
  await booking.save();

  // Create or update payment record to succeeded
  await Payment.findOneAndUpdate(
    { booking: booking._id },
    {
      user: booking.user,
      amount: Math.round(booking.totalPrice * 100),
      currency: 'usd',
      status: 'succeeded',
      paymentMethod: 'card',
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Payment confirmed & reservation activated successfully',
    data: booking,
  });
});
