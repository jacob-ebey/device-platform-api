import generator from 'generate-password';

import User from '../models/user.model';
import Gateway from '../models/gateway.model';

/**
 * Get a specific gateway
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function get(req, res, next) {
  Gateway.get(req.params.id)
    .then((project) => {
      res.json(project);
    })
    .catch(e => next(e));
}

/**
 * Gets all gateways for a user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getAll(req, res, next) {
  User.getGateways(req.user._id, (error, projects) => {
    if (error) {
      return next(error);
    }

    return res.json(projects);
  });
}

/**
 * Create a new gateway
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addGateway(req, res, next) {
  User.get(req.user._id, 'ownedGateways')
    .then((user) => {
      const registrationCode = generator.generate({
        length: 10,
        numbers: true
      });
      const gateway = new Gateway({
        name: req.body.name,
        ownedBy: req.user._id,
        registrationCode
      });

      gateway.save()
        .then((savedGateway) => {
          user.ownedGateways.push(savedGateway._id);

          user.save()
            .then(() => {
              res.json(savedGateway);
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

export default { get, getAll, addGateway };
