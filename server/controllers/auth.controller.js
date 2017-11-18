import users from '../repos/users';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  users
    .login(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch(e => next(e));
}

export default { login };
