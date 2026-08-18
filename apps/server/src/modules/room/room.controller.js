// Room controller handling room creation, updates, public views, and soft delete
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Room from './room.model.js';
import Booking from '../booking/booking.model.js';
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

  const rooms = await Room.find({ hotel: hotelId, isDeleted: { $ne: true }, isActive: true }).sort({ pricePerNight: 1 });

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
  if (!room || !room.isActive || room.isDeleted) {
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
  const roomId = req.params.id;

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  const hasBooking = await Booking.exists({ room: roomId });

  if (!hasBooking) {
    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({
      success: true,
      message: 'Room permanently deleted',
    });
  } else {
    await Room.findByIdAndUpdate(roomId, { isActive: false, isDeleted: true });

    return res.status(200).json({
      success: true,
      message: 'Room has booking history, deactivated instead of deleted',
    });
  }
});
