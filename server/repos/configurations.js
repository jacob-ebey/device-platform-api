import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Configuration, { DeviceConfiguration, ControllerConfiguration } from '../models/configuration.model';
import User from '../models/user.model';

export default {
  getAll(userId) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .populate('ownedConfigurations')
        .populate('sharedConfigurations')
        .exec()
        .then(user => resolve([
          ...user.ownedConfigurations,
          ...user.sharedConfigurations
        ]))
        .catch(e => reject(e));
    });
  },

  get(userId, configId) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            Configuration
              .get(configId)
              .then(config => resolve(config))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        })
        .catch(e => reject(e));
    });
  },

  add(userId, newConfig) {
    return new Promise((resolve, reject) => {
      const configuration = new Configuration({
        name: newConfig.name,
        ownedBy: userId
      });

      configuration
        .save()
        .then((savedConfiguration) => {
          User
            .findByIdAndUpdate(
              userId,
              { $push: { ownedConfigurations: savedConfiguration } },
              { safe: true }
            )
            .exec()
            .then(() => resolve(savedConfiguration))
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });
  },

  edit(userId, configId, newConfig) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            Configuration.findByIdAndUpdate(
              configId,
              {
                name: newConfig.name
              },
              { upsert: true, new: true })
              .exec()
              .then(result => resolve(result))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        });
    });
  },

  delete(userId, configId) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            Configuration
              .remove({ _id: configId })
              .exec()
              .then(() => resolve(true))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        })
        .catch(e => reject(e));
    });
  },

  addDevice(userId, configId, device) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            const deviceConfig = new DeviceConfiguration({
              name: device.name,
              type: device.type,
              mode: device.mode,
              address: device.address,
              defaultValue: device.defaultValue
            });
            deviceConfig
              .save()
              .then((savedDeviceConfig) => {
                Configuration
                  .findByIdAndUpdate(
                    configId,
                    { $push: { devices: savedDeviceConfig } },
                    { safe: true }
                  )
                  .exec()
                  .then(() => resolve(savedDeviceConfig))
                  .catch(e => reject(e));
              })
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        });
    });
  },

  editDevice(userId, configId, deviceId, device) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            DeviceConfiguration.findByIdAndUpdate(
              deviceId,
              {
                name: device.name,
                type: device.type,
                mode: device.mode,
                address: device.address,
                defaultValue: device.defaultValue
              },
              { upsert: true, new: true })
              .exec()
              .then(result => resolve(result))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        });
    });
  },

  deleteDevice(userId, configId, deviceId) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            DeviceConfiguration
              .remove({ _id: deviceId })
              .exec()
              .then(() => resolve(true))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        })
        .catch(e => reject(e));
    });
  },

  addController(userId, configId, controller) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            const controllerConfig = new ControllerConfiguration({
              name: controller.name,
              type: controller.type,
              inputs: controller.inputs,
              outputs: controller.outputs,
              schedule: controller.schedule
            });
            controllerConfig
              .save()
              .then((savedControllerConfig) => {
                Configuration
                  .findByIdAndUpdate(
                    configId,
                    { $push: { controllers: savedControllerConfig } },
                    { safe: true }
                  )
                  .exec()
                  .then(() => resolve(savedControllerConfig))
                  .catch(e => reject(e));
              })
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        });
    });
  },

  editController(userId, configId, controllerId, controller) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            ControllerConfiguration.findByIdAndUpdate(
              controllerId,
              {
                name: controller.name,
                type: controller.type,
                inputs: controller.inputs,
                outputs: controller.outputs,
                schedule: controller.schedule
              },
              { upsert: true, new: true })
              .exec()
              .then(result => resolve(result))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        });
    });
  },

  deleteController(userId, configId, controllerId) {
    return new Promise((resolve, reject) => {
      User
        .findById(userId)
        .exec()
        .then((user) => {
          const ownsConfig = user.ownedConfigurations.some(config => String(config) === configId);

          if (ownsConfig) {
            ControllerConfiguration
              .remove({ _id: controllerId })
              .exec()
              .then(() => resolve(true))
              .catch(e => reject(e));
          } else {
            reject(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
          }
        })
        .catch(e => reject(e));
    });
  }
};
