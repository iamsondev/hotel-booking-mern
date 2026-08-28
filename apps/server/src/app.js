import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';

import authRoutes from './modules/auth/auth.routes.js';
import hotelRoutes from './modules/hotel/hotel.routes.js';
import roomRoutes from './modules/room/room.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import userRoutes from './modules/user/user.routes.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// ── CORS must come FIRST before any route ──────────────────────
app.use(
  cors({
    origin: env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Stripe Webhook needs raw body BEFORE express.json() — only for webhook path
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Global JSON & form parsers (for all other routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling Middlewares (Must be mounted last)
app.use(notFound);
app.use(errorHandler);

export default app;
