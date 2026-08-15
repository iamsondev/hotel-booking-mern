// Room controller handling room creation, updates, public views, and soft delete
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Room from './room.model.js';
import ApiError from '../../utils/ApiError.js';
import { createRoomSchema, updateRoomSchema } from './room.validation.js';

// @desc    Create a new room under a hotel (Hotel owner / Admin)
// @route   POST /api/hotels/:hotelId/rooms
export const createRoom = asyncHandler(async (req, res) => {
  const validation = createRoomSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  const { hotelId } = req.params;

  const room = await Room.create({
    ...validation.data,
    hotel: hotelId,
  });

  res.status(201).json({
    success: true,
    message: 'Room type added to hotel successfully',
    data: room,
  });
});

// @desc    Get all active rooms for a hotel (Public)
// @route   GET /api/hotels/:hotelId/rooms
export const getRoomsByHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new ApiError(400, 'Invalid Hotel ID format');
  }

  const rooms = await Room.find({ hotel: hotelId, isActive: true }).sort({ pricePerNight: 1 });

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

// @desc    Get single room by ID (Public)
// @route   GET /api/rooms/:id
export const getRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Room ID format');
  }

  const room = await Room.findById(id).populate('hotel', 'name address starRating images');
  if (!room || !room.isActive) {
    throw new ApiError(404, 'Room not found or no longer active');
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Update room details (Owner / Admin)
// @route   PUT /api/rooms/:id
export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const validation = updateRoomSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  const room = await Room.findByIdAndUpdate(
    id,
    { $set: validation.data },
    { new: true, runValidators: true }
  );

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  res.status(200).json({
    success: true,
    message: 'Room details updated successfully',
    data: room,
  });
});

// @desc    Soft delete room (Owner / Admin) - set isActive to false
// @route   DELETE /api/rooms/:id
export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  room.isActive = false;
  await room.save();

  res.status(200).json({
    success: true,
    message: 'Room deactivated (soft deleted) successfully',
  });
});
