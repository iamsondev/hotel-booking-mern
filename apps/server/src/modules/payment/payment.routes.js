// Express routes for payment checkout and webhook endpoints
import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getPaymentByBooking,
} from './payment.controller.js';
import protect from '../../middleware/protect.js';

const router = express.Router();

// Webhook endpoint (Raw body required, no auth middleware as Stripe calls it directly)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/booking/:bookingId', protect, getPaymentByBooking);

export default router;
