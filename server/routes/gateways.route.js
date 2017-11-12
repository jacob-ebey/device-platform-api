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

export default router;
