// Express routes for creating and managing room bookings
import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getHotelBookings,
  cancelBooking,
  getAllBookings,
} from './booking.controller.js';
import protect from '../../middleware/protect.js';
import authorize from '../../middleware/authorize.js';
import isHotelOwnerOf from '../../middleware/isHotelOwnerOf.js';

const router = express.Router();

// All booking routes require authentication
router.use(protect);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);

// Admin route (must come before /:id)
router.get('/admin/all', authorize('admin'), getAllBookings);

// Hotel Owner route (must come before /:id)
router.get('/hotel/:hotelId', authorize('hotelOwner', 'admin'), isHotelOwnerOf, getHotelBookings);

router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
