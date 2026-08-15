// Zod validation schemas for hotel listing creation and update requests
import { z } from 'zod';

export const createHotelSchema = z.object({
  name: z.string().min(3, 'Hotel name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().optional(),
  }),
  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.array(z.number()).length(2, 'Coordinates must be [longitude, latitude]'),
    })
    .optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  starRating: z.number().min(1).max(5).optional(),
});

export const updateHotelSchema = createHotelSchema.partial();
