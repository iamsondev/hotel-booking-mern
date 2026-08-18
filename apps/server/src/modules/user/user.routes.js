// Express routes for user profiles and admin vendor approval management
import express from 'express';
import {
  getUserProfile,
  getPendingOwners,
  approveOwner,
  rejectOwner,
  getAllUsers,
} from './user.controller.js';
import protect from '../../middleware/protect.js';
import authorize from '../../middleware/authorize.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);

// Admin Specific Routes
router.get('/admin/pending-owners', protect, authorize('admin'), getPendingOwners);
router.patch('/admin/approve-owner/:id', protect, authorize('admin'), approveOwner);
router.patch('/admin/reject-owner/:id', protect, authorize('admin'), rejectOwner);
router.get('/admin/all', protect, authorize('admin'), getAllUsers);

export default router;
