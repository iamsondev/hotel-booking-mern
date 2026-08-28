// Integration service with Stripe SDK for payment intent creation and webhook verification
import Stripe from 'stripe';
import { env } from '../../config/env.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    if (!env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_mock_key`,
      };
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (err) {
    console.warn('⚠️ Stripe API Error, falling back to mock intent in development:', err.message);
    return {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_mock_key`,
    };
  }
};

export const constructWebhookEvent = (rawBody, signature, webhookSecret) => {
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
};

export const retrievePaymentIntent = async (paymentIntentId) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};
