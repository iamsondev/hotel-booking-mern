// Express routes definition for authentication endpoints
import express from 'express';
import {
  register,
  login,
  googleLogin,
  logout,
  refreshToken,
} from './auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;
