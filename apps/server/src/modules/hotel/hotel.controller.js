// Hotel controller handling hotel creation, owner management, search/filter, and admin approval
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Hotel from './hotel.model.js';
import Room from '../room/room.model.js';
import Booking from '../booking/booking.model.js';
import ApiError from '../../utils/ApiError.js';
import { createHotelSchema, updateHotelSchema } from './hotel.validation.js';

// @desc    Create a new hotel (hotelOwner only)
// @route   POST /api/hotels
export const createHotel = asyncHandler(async (req, res) => {
  const validation = createHotelSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  if (req.user.role === 'hotelOwner' && req.user.isApproved === false) {
    throw new ApiError(403, 'Your vendor account is pending admin approval. You cannot register hotels yet.');
  }

  const hotelData = {
    ...validation.data,
    owner: req.user._id,
    status: 'pending',
  };

  if (!hotelData.location || !hotelData.location.coordinates || hotelData.location.coordinates.length < 2) {
    hotelData.location = {
      type: 'Point',
      coordinates: [91.9774, 21.4272],
    };
  }

  const hotel = await Hotel.create(hotelData);

  res.status(201).json({
    success: true,
    message: 'Hotel created successfully and pending admin approval',
    data: hotel,
  });
});

// @desc    Get all approved hotels (Public search & filter with pagination)
// @route   GET /api/hotels
export const getAllHotels = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { status: 'approved', isDeleted: { $ne: true } };

  if (req.query.city) {
    query['address.city'] = { $regex: req.query.city, $options: 'i' };
  }

  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' };
  }

  if (req.query.starRating) {
    query.starRating = Number(req.query.starRating);
  }

  const total = await Hotel.countDocuments(query);
  const hotels = await Hotel.find(query)
    .populate('owner', 'name email phone')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: hotels.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: hotels,
  });
});

// @desc    Get single hotel by ID or Slug (Public)
// @route   GET /api/hotels/:id
export const getHotelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const query = isObjectId
    ? { _id: id, isDeleted: { $ne: true } }
    : { slug: id, isDeleted: { $ne: true } };
  const hotel = await Hotel.findOne(query).populate('owner', 'name email phone avatar');

  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  res.status(200).json({
    success: true,
    data: hotel,
  });
});

// @desc    Update hotel (HotelOwner or Admin)
// @route   PUT /api/hotels/:id
export const updateHotel = asyncHandler(async (req, res) => {
  const validation = updateHotelSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { $set: validation.data },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Hotel updated successfully',
    data: updatedHotel,
  });
});

// @desc    Delete hotel (HotelOwner or Admin)
// @route   DELETE /api/hotels/:id
export const deleteHotel = asyncHandler(async (req, res) => {
  const hotelId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new ApiError(400, 'Invalid Hotel ID format');
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  // Find all rooms under this hotel
  const rooms = await Room.find({ hotel: hotelId }).select('_id');
  const roomIds = rooms.map((room) => room._id);

  // Check if any booking exists for this hotel or its rooms
  const hasHotelBooking = await Booking.exists({ hotel: hotelId });
  const hasRoomBooking = roomIds.length > 0 ? await Booking.exists({ room: { $in: roomIds } }) : false;
  const hasBooking = Boolean(hasHotelBooking || hasRoomBooking);

  if (!hasBooking) {
    // No bookings: Permanent delete
    await Room.deleteMany({ hotel: hotelId });
    await Hotel.findByIdAndDelete(hotelId);

    return res.status(200).json({
      success: true,
      message: 'Hotel permanently deleted',
    });
  } else {
    // Booking exists: Soft delete (deactivate hotel and rooms)
    await Hotel.findByIdAndUpdate(hotelId, { isDeleted: true, status: 'suspended' });
    await Room.updateMany({ hotel: hotelId }, { isActive: false, isDeleted: true });

    return res.status(200).json({
      success: true,
      message: 'Hotel has booking history, deactivated instead of deleted',
    });
  }
});

// @desc    Get owner's own hotels (All statuses)
// @route   GET /api/hotels/owner/my-hotels
export const getMyHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels,
  });
});

// @desc    Get pending hotels list (Admin only)
// @route   GET /api/hotels/admin/pending
export const getPendingHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ status: 'pending' })
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 });

  const data = await Promise.all(
    hotels.map(async (hotel) => {
      const rooms = await Room.find({ hotel: hotel._id, isDeleted: { $ne: true } })
        .select('roomType pricePerNight totalRooms capacity amenities images isActive');

      const roomCount = rooms.length; // total room categories
      const totalPhysicalRooms = rooms.reduce((sum, r) => {
        const count = Number(r.totalRooms);
        return sum + (count > 0 ? count : 1);
      }, 0);

      return {
        ...hotel.toObject(),
        roomCount,
        totalPhysicalRooms,
        roomsDetails: rooms,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

// @desc    Approve hotel listing (Admin only)
// @route   PATCH /api/hotels/:id/approve
export const approveHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  hotel.status = 'approved';
  await hotel.save();

  res.status(200).json({
    success: true,
    message: 'Hotel approved successfully',
    data: hotel,
  });
});

// @desc    Reject hotel listing (Admin only)
// @route   PATCH /api/hotels/:id/reject
export const rejectHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  hotel.status = 'rejected';
  await hotel.save();

  res.status(200).json({
    success: true,
    message: 'Hotel listing rejected',
    data: hotel,
  });
});
