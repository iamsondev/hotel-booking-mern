// Environment variables loading and validation using dotenv/zod
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string({ required_error: 'MONGO_URI is required' }),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }),
  JWT_EXPIRES_IN: z.string().default('30d'),
  STRIPE_SECRET_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
