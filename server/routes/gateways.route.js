import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import gatewaysCtrl from '../controllers/gateways.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/gateways - Gets all gateways for a user */
router.route('/')
  .get(expressJwt({ secret: config.jwtSecret }), gatewaysCtrl.getAll);

/** GET /api/gateways/:id - Get a specific gateway */
router.route('/:id')
  .get(expressJwt({ secret: config.jwtSecret }), gatewaysCtrl.get);

/** POST /api/gateways - Create a new gateway */
router.route('/')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addGateway),
    gatewaysCtrl.addGateway);

/** DELETE /api/gateways/:id - Delete a gateway */
router.route('/:id')
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.deleteProject),
    gatewaysCtrl.deleteGateway);

/** PUT /api/gateways/:id - Link a configuration to a gateway */
router.route('/:gatewayId/config/:configId')
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.linkConfiguration),
    gatewaysCtrl.linkConfiguration);

/** POST /api/gateways/register - Register a physical device to a gateway */
router.route('/register')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.registerGateway),
    gatewaysCtrl.registerGateway);

/** POST /api/gateways/unregister/:id - Unregister a physical device from a gateway */
router.route('/unregister/:id')
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.unregisterGateway),
    gatewaysCtrl.unregisterGateway);

/** GET /api/gateways/:id/config - Get the configuration for a gateway */
router.route('/:id/config')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.getConfigForGateway),
    gatewaysCtrl.getConfig);

/** GET /api/gateways/:id/logs - Get the logs for a gateway */
router.route('/:id/logs')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.getLogsForConfiguration),
    gatewaysCtrl.getLogs);

export default router;
