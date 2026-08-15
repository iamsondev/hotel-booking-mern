// Express routes for managing rooms within hotels
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Get rooms' }));
router.post('/', (req, res) => res.json({ message: 'Add room to hotel' }));

export default router;
