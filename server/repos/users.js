import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

const invalidErrorMessage = 'Invalid username or password';

export default {
  login(loginModel) {
    return new Promise((resolve, reject) => {
      if (!loginModel || !loginModel.username || !loginModel.password) {
        return reject(new APIError('Please provide a username and password', httpStatus.BAD_REQUEST, true));
      }

      return User
        .findOne({ username: loginModel.username }, 'username password')
        .exec()
        .then(user =>
          bcrypt
            .compare(loginModel.password, user.password)
            .then((match) => {
              if (match) {
                const token = jwt.sign({
                  username: user.username,
                  _id: user._id
                }, config.jwtSecret);

                resolve({
                  token,
                  username: user.username
                });
              } else {
                reject(new APIError(invalidErrorMessage, httpStatus.UNAUTHORIZED, true));
              }
            })
            .catch(() => reject(new APIError(invalidErrorMessage, httpStatus.UNAUTHORIZED, true)))
        )
        .catch(() => reject(new APIError(invalidErrorMessage, httpStatus.UNAUTHORIZED, true)));
    });
  }
};
