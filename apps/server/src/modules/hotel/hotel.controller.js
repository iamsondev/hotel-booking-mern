// Hotel controller handling hotel creation, owner management, search/filter, and admin approval
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Hotel from './hotel.model.js';
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

  const hotel = await Hotel.create({
    ...validation.data,
    owner: req.user._id,
    status: 'pending',
  });

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

  const query = { status: 'approved' };

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

  const query = isObjectId ? { _id: id } : { slug: id };
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
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  await hotel.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Hotel deleted successfully',
  });
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

  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels,
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
