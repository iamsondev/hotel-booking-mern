// Booking controller handling user bookings, owner reservations view, cancel, and admin views
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Booking from './booking.model.js';
import Hotel from '../hotel/hotel.model.js';
import ApiError from '../../utils/ApiError.js';
import { createBookingSchema } from './booking.validation.js';
import { checkAvailability, calculateTotalPrice } from './booking.service.js';

// @desc    Create a new booking reservation (User)
// @route   POST /api/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const validation = createBookingSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  const { roomId, checkInDate, checkOutDate, numberOfGuests, numberOfRooms } = validation.data;

  // Check room availability for selected dates
  const availability = await checkAvailability(
    roomId,
    checkInDate,
    checkOutDate,
    numberOfRooms
  );

  if (!availability.isAvailable) {
    throw new ApiError(
      400,
      `Requested rooms not available for selected dates. Only ${availability.availableRooms} room(s) left.`
    );
  }

  // Calculate total price
  const totalPrice = calculateTotalPrice(
    availability.roomPrice,
    checkInDate,
    checkOutDate,
    numberOfRooms
  );

  const booking = await Booking.create({
    user: req.user._id,
    hotel: availability.hotelId,
    room: roomId,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    numberOfRooms,
    totalPrice,
    status: 'pending',
    paymentStatus: 'unpaid',
  });

  res.status(201).json({
    success: true,
    message: 'Booking reservation created successfully. Please proceed with payment.',
    data: booking,
  });
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my-bookings
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('hotel', 'name address images starRating')
    .populate('room', 'roomType pricePerNight capacity')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get single booking by ID (User owner / Hotel owner / Admin)
// @route   GET /api/bookings/:id
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Booking ID format');
  }

  const booking = await Booking.findById(id)
    .populate('user', 'name email phone')
    .populate('hotel', 'name address owner')
    .populate('room', 'roomType pricePerNight');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const isUserOwner = booking.user._id.toString() === req.user._id.toString();
  const isHotelOwner = booking.hotel.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isUserOwner && !isHotelOwner && !isAdmin) {
    throw new ApiError(403, 'Access denied. You do not have permission to view this booking');
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Get hotel bookings (Hotel owner)
// @route   GET /api/bookings/hotel/:hotelId
export const getHotelBookings = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  const bookings = await Booking.find({ hotel: hotelId })
    .populate('user', 'name email phone')
    .populate('room', 'roomType pricePerNight')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Cancel booking (User)
// @route   PATCH /api/bookings/:id/cancel
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You can only cancel your own bookings');
  }

  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw new ApiError(400, `Cannot cancel booking with status '${booking.status}'`);
  }

  if (new Date() >= new Date(booking.checkInDate)) {
    throw new ApiError(400, 'Cannot cancel booking on or after check-in date');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});

// @desc    Get all bookings (Admin only with pagination)
// @route   GET /api/bookings/admin/all
export const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await Booking.countDocuments();
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('hotel', 'name')
    .populate('room', 'roomType')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: bookings,
  });
});
