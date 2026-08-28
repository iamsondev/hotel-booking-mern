// Zod validation schemas for room creation and modification
import { z } from 'zod';

export const createRoomSchema = z.object({
  roomType: z.enum(['standard', 'deluxe', 'suite', 'executive', 'single', 'double', 'family']),
  pricePerNight: z.number().min(0, 'Price per night must be non-negative'),
  capacity: z.object({
    adults: z.number().min(1, 'At least 1 adult is required'),
    children: z.number().min(0).default(0),
  }),
  totalRooms: z.number().min(1, 'Total rooms must be at least 1'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();
