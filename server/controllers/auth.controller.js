import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  if (req.body) {
    User.findOne({ username: req.body.username }, (error, user) => {
      if (error || !user) {
        const err = new APIError(error || 'User not found', httpStatus.BAD_REQUEST, true);
        next(err);
        return;
      }

      bcrypt.compare(req.body.password, user.password, (result, success) => {
        if (success) {
          const token = jwt.sign({
            username: user.username,
            _id: user._id
          }, config.jwtSecret);
          res.json({
            token,
            username: user.username
          });
        } else {
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          next(err);
        }
      });
    });
  } else {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    next(err);
  }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
