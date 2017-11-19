import iothub from 'azure-iothub';
import generator from 'generate-password';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import Gateway from '../models/gateway.model';

const registry = iothub.Registry.fromConnectionString(config.iotHubConnectionString);

export default {
  registerGateway(userId, gatewayId, registrationCode) {
    return new Promise((resolve, reject) => {
      Gateway
        .findOne({ _id: gatewayId }, 'iotId registrationCode ownedBy')
        .exec()
        .then((gateway) => {
          if (String(gateway.ownedBy) === String(userId)) {
            if (registrationCode === gateway.registrationCode) {
              const registration = {
                deviceId: gatewayId
              };

              registry.create(registration, (error, deviceInfo) => {
                if (!error) {
                  gateway.registrationCode = null;
                  gateway
                    .save()
                    .then(() => {
                      resolve(deviceInfo);
                    })
                    .catch(e => reject(new APIError(e, httpStatus.INTERNAL_SERVER_ERROR, true)));
                } else {
                  reject(new APIError('Could not create registration', httpStatus.INTERNAL_SERVER_ERROR, true));
                }
              });
            } else {
              reject(new APIError('Registration code does not match', httpStatus.BAD_REQUEST, true));
            }
          } else {
            reject(new APIError('User does not have access to the gateway', httpStatus.BAD_REQUEST, true));
          }
        })
        .catch(() => reject(new APIError('Gateway not found', httpStatus.BAD_REQUEST, true)));
    });
  },

  unregisterGateway(userId, gatewayId) {
    return new Promise((resolve, reject) => {
      Gateway
        .findOne({ _id: gatewayId }, 'iotId registrationCode ownedBy')
        .exec()
        .then((gateway) => {
          if (String(gateway.ownedBy) === String(userId)) {
            registry.delete(gatewayId, (error) => {
              if (!error) {
                const registrationCode = generator.generate({
                  length: 10,
                  numbers: true
                });

                gateway.registrationCode = registrationCode;
                gateway
                  .save()
                  .then(() => {
                    resolve(registrationCode);
                  })
                  .catch(e => reject(new APIError(e, httpStatus.INTERNAL_SERVER_ERROR, true)));
              } else {
                reject(new APIError('Could not unregistrater gateway', httpStatus.INTERNAL_SERVER_ERROR, true));
              }
            });
          } else {
            reject(new APIError('User does not have access to the gateway', httpStatus.BAD_REQUEST, true));
          }
        })
        .catch(() => reject(new APIError('Gateway not found', httpStatus.BAD_REQUEST, true)));
    });
  }
};
