import authRoutes from './authentication.route.js';
import userRoutes from './user.route.js';
import profileRoutes from './profile.route.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);

export default router;