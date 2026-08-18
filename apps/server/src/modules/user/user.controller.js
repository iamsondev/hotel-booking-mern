// User controller handling user profile management and admin vendor approval operations
import asyncHandler from 'express-async-handler';
import User from './user.model.js';
import ApiError from '../../utils/ApiError.js';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Get pending vendor/hotelOwner registration list (Admin only)
// @route   GET /api/users/admin/pending-owners
export const getPendingOwners = asyncHandler(async (req, res) => {
  const pendingOwners = await User.find({ role: 'hotelOwner', isApproved: false })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pendingOwners.length,
    data: pendingOwners,
  });
});

// @desc    Approve vendor/hotelOwner account (Admin only)
// @route   PATCH /api/users/admin/approve-owner/:id
export const approveOwner = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isApproved = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Vendor account for ${user.name} has been approved successfully.`,
    data: user,
  });
});

// @desc    Reject vendor/hotelOwner account (Admin only)
// @route   PATCH /api/users/admin/reject-owner/:id
export const rejectOwner = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isApproved = false;
  user.role = 'user'; // Demote to regular user
  await user.save();

  res.status(200).json({
    success: true,
    message: `Vendor request for ${user.name} was rejected. Account converted to regular user.`,
    data: user,
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users/admin/all
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
