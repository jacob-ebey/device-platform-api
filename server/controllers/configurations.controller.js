import User from '../models/user.model';

/**
 * Gets all configurations for a user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getAll(req, res, next) {
  User.getConfigurations(req.user._id, (error, configurations) => {
    if (error) {
      return next(error);
    }

    return res.json(configurations);
  });
}

export default { getAll };
