// Express routes for managing rooms within hotels (nested routes enabled with mergeParams)
import express from 'express';
import {
  createRoom,
  getRoomsByHotel,
  getRoomById,
  updateRoom,
  deleteRoom,
} from './room.controller.js';
import protect from '../../middleware/protect.js';
import authorize from '../../middleware/authorize.js';
import isHotelOwnerOf from '../../middleware/isHotelOwnerOf.js';

const router = express.Router({ mergeParams: true });

// Hotel nested routes (/api/hotels/:hotelId/rooms)
router
  .route('/')
  .get(getRoomsByHotel)
  .post(protect, authorize('hotelOwner', 'admin'), isHotelOwnerOf, createRoom);

// Single room routes (/api/rooms/:id)
router
  .route('/:id')
  .get(getRoomById)
  .put(protect, authorize('hotelOwner', 'admin'), isHotelOwnerOf, updateRoom)
  .delete(protect, authorize('hotelOwner', 'admin'), isHotelOwnerOf, deleteRoom);

export default router;
