import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import configurationsCtrl from '../controllers/configurations.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/configurations - Gets all configurations for a user */
router.route('/')
  .get(expressJwt({ secret: config.jwtSecret }), configurationsCtrl.getAll);

/** GET /api/configurations/:id - Gets all configurations for a user */
router.route('/:id')
  .get(expressJwt({ secret: config.jwtSecret }), configurationsCtrl.get);


/** POST /api/configurations - Create a new configuration */
router.route('/')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addConfiguration),
    configurationsCtrl.addConfiguration);

/** DELETE /api/configurations/:id - Delete a configuration */
router.route('/:id')
  .delete(expressJwt({ secret: config.jwtSecret }), configurationsCtrl.deleteConfiguration);

export default router;
