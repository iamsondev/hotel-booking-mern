// Auth controller to handle HTTP requests for registration, login, Google OAuth, logout & refresh token
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';
import ApiError from '../../utils/ApiError.js';
import { env } from '../../config/env.js';
import { registerSchema, loginSchema, googleLoginSchema } from './auth.validation.js';
import { generateAccessToken, generateRefreshToken, verifyGoogleToken } from './auth.service.js';

// Helper to set refreshToken cookie
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user / hotelOwner
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  const { name, email, password, role, phone } = validation.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const isApproved = role === 'hotelOwner' ? false : true;

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isApproved,
    phone,
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      accessToken,
    },
  });
});

// @desc    Login user / hotelOwner / admin
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map((e) => e.message).join(', ');
    throw new ApiError(400, errorMsg);
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      accessToken,
    },
  });
});

// @desc    Login/Register via Google OAuth
// @route   POST /api/auth/google
export const googleLogin = asyncHandler(async (req, res) => {
  const validation = googleLoginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, 'Google ID token is required');
  }

  const { idToken } = validation.data;
  const payload = await verifyGoogleToken(idToken);
  const { sub: googleId, email, name, picture: avatar } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar,
      role: 'user',
      isApproved: true,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    if (avatar) user.avatar = avatar;
    await user.save();
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Google login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      avatar: user.avatar,
      accessToken,
    },
  });
});

// @desc    Logout user and clear refreshToken cookie
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Refresh access token using refreshToken cookie
// @route   POST /api/auth/refresh-token
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(401, 'Refresh token not found');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});
