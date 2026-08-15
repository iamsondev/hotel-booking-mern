// Express routes for creating and managing room bookings
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Get bookings' }));
router.post('/', (req, res) => res.json({ message: 'Create booking' }));

export default router;
