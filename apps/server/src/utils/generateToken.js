// Utility function to generate JWT token with userId and role
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE || '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
