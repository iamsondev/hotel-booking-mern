// Business logic for date validation, room availability checks, and price calculations
import Booking from './booking.model.js';
import Room from '../room/room.model.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Check if room has required availability for requested dates
 */
export const checkAvailability = async (roomId, checkInDate, checkOutDate, requestedRooms = 1) => {
  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    throw new ApiError(404, 'Room not found or no longer active');
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Find overlapping active/pending bookings
  const overlappingBookings = await Booking.find({
    room: roomId,
    status: { $in: ['pending', 'confirmed', 'checked-in'] },
    $and: [{ checkInDate: { $lt: checkOut } }, { checkOutDate: { $gt: checkIn } }],
  });

  const bookedRoomsCount = overlappingBookings.reduce(
    (total, booking) => total + booking.numberOfRooms,
    0
  );

  const availableRooms = room.totalRooms - bookedRoomsCount;

  return {
    isAvailable: availableRooms >= requestedRooms,
    availableRooms,
    roomPrice: room.pricePerNight,
    hotelId: room.hotel,
  };
};

/**
 * Calculate total price based on price per night and number of nights
 */
export const calculateTotalPrice = (pricePerNight, checkInDate, checkOutDate, numberOfRooms = 1) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (nightCount <= 0) {
    throw new ApiError(400, 'Invalid date selection. Stay must be at least 1 night.');
  }

  return pricePerNight * nightCount * numberOfRooms;
};
