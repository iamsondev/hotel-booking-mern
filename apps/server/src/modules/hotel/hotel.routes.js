// Express routes for hotel listing, creation, modification, and admin approval
import express from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getMyHotels,
  getPendingHotels,
  approveHotel,
  rejectHotel,
} from './hotel.controller.js';
import protect from '../../middleware/protect.js';
import authorize from '../../middleware/authorize.js';
import isHotelOwnerOf from '../../middleware/isHotelOwnerOf.js';

const router = express.Router();

// Public Routes
router.get('/', getAllHotels);

// HotelOwner specific route (must come before /:id)
router.get('/owner/my-hotels', protect, authorize('hotelOwner', 'admin'), getMyHotels);

// Admin specific routes (must come before /:id)
router.get('/admin/pending', protect, authorize('admin'), getPendingHotels);
router.patch('/:id/approve', protect, authorize('admin'), approveHotel);
router.patch('/:id/reject', protect, authorize('admin'), rejectHotel);

// Single Hotel Public Route
router.get('/:id', getHotelById);

// Protected HotelOwner/Admin Routes
router.post('/', protect, authorize('hotelOwner', 'admin'), createHotel);
router.put('/:id', protect, authorize('hotelOwner', 'admin'), isHotelOwnerOf, updateHotel);
router.delete('/:id', protect, authorize('hotelOwner', 'admin'), isHotelOwnerOf, deleteHotel);

export default router;
