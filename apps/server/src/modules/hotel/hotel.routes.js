// Express routes for hotel listing, creation, modification, and admin approval
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Get all approved hotels' }));
router.post('/', (req, res) => res.json({ message: 'Create a new hotel' }));
router.put('/:id/approve', (req, res) => res.json({ message: 'Admin approve hotel' }));

export default router;
