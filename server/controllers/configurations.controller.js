import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Configuration from '../models/configuration.model';
import User from '../models/user.model';

import configurations from '../repos/configurations';

/**
 * Get a specific configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function get(req, res, next) {
  configurations
    .get(req.user._id, req.params.id)
    .then((config) => {
      res.json(config);
    })
    .catch(e => next(e));
}

/**
 * Gets all configurations for a user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getAll(req, res, next) {
  configurations
    .getAll(req.user._id)
    .then((configs) => {
      res.json(configs);
    })
    .catch(e => next(e));
}

/**
 * Create a new project
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addConfiguration(req, res, next) {
  User.get(req.user._id, 'ownedConfigurations')
    .then((user) => {
      const configuration = new Configuration({
        name: req.body.name,
        ownedBy: req.user._id
      });

      configuration.save()
        .then((savedConfiguration) => {
          user.ownedConfigurations.push(savedConfiguration._id);

          user.save()
            .then(() => {
              res.json(savedConfiguration);
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

/**
 * Add a device to a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addDeviceToConfiguration(req, res, next) {
  configurations.addDevice(req.user._id, req.params.id, req.body)
    .then((newDevice) => {
      res.json(newDevice);
    })
    .catch(e => next(e));
}

/**
 * Edit a device from a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function editDevice(req, res, next) {
  configurations.editDevice(req.user._id, req.params.configId, req.params.deviceId, req.body)
  .then((editedDevice) => {
    res.json(editedDevice);
  })
  .catch(e => next(e));
}

/**
 * Remove a device from a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function removeDeviceFromConfiguration(req, res, next) {
  configurations
    .deleteDevice(req.user._id, req.params.configId, req.params.deviceId)
    .then((result) => {
      res.json(result);
    })
    .catch(e => next(e));
}

/**
 * Add a controller to a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addControllerToConfiguration(req, res, next) {
  configurations.addController(req.user._id, req.params.id, req.body)
    .then((newController) => {
      res.json(newController);
    })
    .catch(e => next(e));
}

/**
 * Edit a controller from a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function editController(req, res, next) {
  configurations.editController(
    req.user._id,
    req.params.configId,
    req.params.controllerId, req.body
  )
  .then((editedDevice) => {
    res.json(editedDevice);
  })
  .catch(e => next(e));
}

/**
 * Remove a controller from a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function removeControllerFromConfiguration(req, res, next) {
  configurations
    .deleteController(req.user._id, req.params.configId, req.params.controllerId)
    .then((result) => {
      res.json(result);
    })
    .catch(e => next(e));
}

/**
 * Delete a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteConfiguration(req, res, next) {
  Configuration
    .findById(req.params.id)
    .exec()
    .then((configuration) => {
      if (String(configuration.ownedBy) === String(req.user._id)) {
        configuration.remove()
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

export default {
  get,
  getAll,
  addConfiguration,
  addDeviceToConfiguration,
  editDevice,
  removeDeviceFromConfiguration,
  addControllerToConfiguration,
  editController,
  removeControllerFromConfiguration,
  deleteConfiguration
};
