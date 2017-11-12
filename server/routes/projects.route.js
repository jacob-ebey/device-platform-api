import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import projectsCtrl from '../controllers/projects.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/projects - Gets all projects for a user */
router.route('/')
  .get(expressJwt({ secret: config.jwtSecret }), projectsCtrl.getAll);

/** GET /api/projects/:id - Get a specific project */
router.route('/:id')
  .get(expressJwt({ secret: config.jwtSecret }), projectsCtrl.get);

/** POST /api/projects - Create a new project */
router.route('/')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addProject),
    projectsCtrl.addProject);

/** POST /api/projects/:projectId/:gatewayId - Add a gateway to a project */
router.route('/:projectId/:gatewayId')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addGatewayToProject),
    projectsCtrl.addGatewayToProject);

/** DELETE /api/projects - Delete a new project */
router.route('/:id')
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.deleteProject),
    projectsCtrl.deleteProject);

export default router;
