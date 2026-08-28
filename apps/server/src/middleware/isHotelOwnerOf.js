// Middleware to verify if logged-in hotelOwner owns the specified hotel resource
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import Hotel from '../modules/hotel/hotel.model.js';
import Room from '../modules/room/room.model.js';

export const isHotelOwnerOf = asyncHandler(async (req, res, next) => {
  let hotelId = req.params?.hotelId || req.body?.hotel;
  const targetId = req.params?.roomId || req.params?.id;

  // If hotelId is not directly provided, resolve targetId (Room ID or Hotel ID)
  if (!hotelId && targetId) {
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      throw new ApiError(400, 'Invalid ID format');
    }

    // Check if targetId is a Room ID
    const room = await Room.findById(targetId);
    if (room) {
      hotelId = room.hotel;
    } else {
      hotelId = targetId;
    }
  }

  if (!hotelId) {
    throw new ApiError(400, 'Hotel ID or Room ID is required for authorization check');
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new ApiError(400, 'Invalid Hotel ID format');
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  // Admin bypass check
  if (req.user?.role === 'admin') {
    req.hotel = hotel;
    return next();
  }

  // Check if current user is the owner of the hotel
  if (!hotel.owner || !req.user?._id || hotel.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied. You do not own this hotel resource');
  }

  req.hotel = hotel;
  next();
});

export default isHotelOwnerOf;
