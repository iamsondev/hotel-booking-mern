// Express routes for payment checkout and webhook endpoints
import express from 'express';

const router = express.Router();

router.post('/checkout-session', (req, res) => res.json({ message: 'Create Stripe checkout session' }));
router.post('/webhook', (req, res) => res.json({ message: 'Stripe webhook listener' }));

export default router;
