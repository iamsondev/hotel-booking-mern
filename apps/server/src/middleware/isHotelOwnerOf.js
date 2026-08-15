// Middleware to verify if logged-in hotelOwner owns the specified hotel resource
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import Hotel from '../modules/hotel/hotel.model.js';

export const isHotelOwnerOf = asyncHandler(async (req, res, next) => {
  const hotelId = req.params.hotelId || req.params.id || req.body.hotel;
  if (!hotelId) {
    throw new ApiError(400, 'Hotel ID is required for authorization check');
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to perform actions on this hotel');
  }

  req.hotel = hotel;
  next();
});
