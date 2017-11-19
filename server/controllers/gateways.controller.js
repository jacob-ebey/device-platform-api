import generator from 'generate-password';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import Gateway from '../models/gateway.model';
import gateways from '../repos/gateways';

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

/**
 * Delete a project
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteGateway(req, res, next) {
  Gateway
    .findById(req.params.id)
    .exec()
    .then((gateway) => {
      if (String(gateway.ownedBy) === String(req.user._id)) {
        gateway.remove()
          .then(() => {
            res.json(true);
          })
          .catch(e => next(e));
      } else {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        next(err);
      }
    })
    .catch(e => next(e));
}

/**
 * Link a configuration to a gateway
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function linkConfiguration(req, res, next) {
  Gateway
  .findById(req.params.gatewayId)
  .exec()
  .then((gateway) => {
    if (String(gateway.ownedBy) === String(req.user._id)) {
      gateway.configuration = req.params.configId;
      gateway.save()
        .then(() => {
          res.json(true);
        })
        .catch(e => next(e));
    } else {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      next(err);
    }
  })
  .catch(e => next(e));
}

/**
 * Register a physical device to a gateway
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function registerGateway(req, res, next) {
  gateways
    .registerGateway(req.user._id, req.body.gatewayId, req.body.registrationCode)
    .then(result => res.json(result))
    .catch(e => next(e));
}

/**
 * Unregister a physical device from a gateway
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function unregisterGateway(req, res, next) {
  gateways
    .unregisterGateway(req.user._id, req.params.id)
    .then(result => res.json(result))
    .catch(e => next(e));
}

export default {
  get,
  getAll,
  addGateway,
  deleteGateway,
  linkConfiguration,
  registerGateway,
  unregisterGateway
};
