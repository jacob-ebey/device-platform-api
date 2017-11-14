import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Configuration from '../models/configuration.model';
import User from '../models/user.model';

/**
 * Get a specific configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function get(req, res, next) {
  Configuration.get(req.params.id)
    .then((project) => {
      res.json(project);
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
  User.getConfigurations(req.user._id, (error, configurations) => {
    if (error) {
      return next(error);
    }

    return res.json(configurations);
  });
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
  Configuration.findByIdAndUpdate(
      req.params.id,
      { $push: { devices: req.body } },
      { safe: true, new: true })
    .exec()
    .then((result) => {
      res.json(result.devices[result.devices.length - 1]);
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
  Configuration.get(req.params.configId)
    .then((configuration) => {
      if (String(configuration.ownedBy._id) === String(req.user._id)) {
        Configuration
          .update(
            { _id: req.params.configId },
            { $pullAll: { devices: [new mongoose.Types.ObjectId(req.params.deviceId)] } })
          .exec()
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
  removeDeviceFromConfiguration,
  deleteConfiguration
};
