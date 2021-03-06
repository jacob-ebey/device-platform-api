import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import configurationsRoutes from './configurations.route';
import projectsRoutes from './projects.route';
import gatewaysRoutes from './gateways.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount configuration routes at /configurations
router.use('/configurations', configurationsRoutes);

// mount project routes at /projects
router.use('/projects', projectsRoutes);

// mount gateway routes at /gateways
router.use('/gateways', gatewaysRoutes);

export default router;
