import userRoutes from './user.route.js';
import authRoutes from './authentication.route.js';
import express from 'express';
const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;