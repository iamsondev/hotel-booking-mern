// Business logic, token generation, and Google auth verification
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../../config/env.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId, role) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE || '30d',
  });
};

export const verifyGoogleToken = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};
