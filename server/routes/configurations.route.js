import express from 'express';
import expressJwt from 'express-jwt';
import configurationsCtrl from '../controllers/configurations.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/configurations - Gets all configurations for a user */
router.route('/')
  .get(expressJwt({ secret: config.jwtSecret }), configurationsCtrl.getAll);


export default router;
