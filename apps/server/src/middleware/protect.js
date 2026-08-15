// Middleware to authenticate JWT token and attach user to request object
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import User from '../modules/user/user.model.js';
import { env } from '../config/env.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      throw new ApiError(401, 'Not authorized, user no longer exists');
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'CastError') {
      throw new ApiError(400, 'Invalid user ID format in token');
    }
    throw new ApiError(401, 'Not authorized, token validation failed');
  }
});

export default protect;
