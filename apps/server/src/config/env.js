import dotenv from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve .env path relative to this file (src/config/env.js → ../../.env = apps/server/.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string({ required_error: 'MONGO_URI is required' }),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }),
  JWT_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_REFRESH_EXPIRE: z.string().default('30d'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation error! Missing or invalid variables:');
    const formattedErrors = result.error.format();
    Object.keys(formattedErrors).forEach((key) => {
      if (key !== '_errors') {
        console.error(`   - ${key}: ${formattedErrors[key]?._errors?.join(', ')}`);
      }
    });
    throw new Error('Missing or invalid environment variables in .env');
  }
  return result.data;
};

export const env = parseEnv();
