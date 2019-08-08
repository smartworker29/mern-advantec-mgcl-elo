import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import wellRoutes from './well.route';
import docRoutes from './doc.route';

const router = express.Router();

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

router.use('/wells', wellRoutes);

router.use('/docs', docRoutes);

export default router;