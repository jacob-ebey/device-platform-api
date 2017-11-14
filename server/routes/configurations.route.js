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

/** PUT /api/configurations/:id/devices - Add a new device */
router.route('/:id/devices')
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addDeviceToConfiguration),
    configurationsCtrl.addDeviceToConfiguration);

/** DELETE /api/configurations/:configId/devices/:deviceId - Delete a device */
router.route('/:configId/devices/:deviceId')
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    configurationsCtrl.removeDeviceFromConfiguration);

/** PUT /api/configurations/:id/devices - Add a new controller */
router.route('/:id/controllers')
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addControllerToConfiguration),
    configurationsCtrl.addControllerToConfiguration);

/** DELETE /api/configurations/:configId/controllers/:controllerId - Delete a controller */
router.route('/:configId/controllers/:controllerId')
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    configurationsCtrl.removeControllerFromConfiguration);


/** DELETE /api/configurations/:id - Delete a configuration */
router.route('/:id')
  .delete(expressJwt({ secret: config.jwtSecret }), configurationsCtrl.deleteConfiguration);

export default router;
