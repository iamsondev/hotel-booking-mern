// Zod validation schemas for booking creation and status updates
import { z } from 'zod';

export const createBookingSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  checkInDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid check-in date string format',
  }),
  checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid check-out date string format',
  }),
  numberOfGuests: z.object({
    adults: z.number().min(1, 'At least 1 adult guest is required'),
    children: z.number().min(0).default(0),
  }),
  numberOfRooms: z.number().min(1, 'At least 1 room is required').default(1),
  totalPrice: z.number().min(0).optional(),
});

