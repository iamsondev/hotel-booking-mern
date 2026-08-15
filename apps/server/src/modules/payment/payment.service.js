// Integration service with Stripe SDK for payment intent creation and webhook verification
import Stripe from 'stripe';
import { env } from '../../config/env.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

export const constructWebhookEvent = (rawBody, signature, webhookSecret) => {
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
};

export const retrievePaymentIntent = async (paymentIntentId) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};
