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
  configurations
    .add(req.user._id, req.body)
    .then((newConfig) => {
      res.json(newConfig);
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
  configurations
    .addDevice(req.user._id, req.params.id, req.body)
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
  configurations
    .editDevice(req.user._id, req.params.configId, req.params.deviceId, req.body)
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
  configurations
    .addController(req.user._id, req.params.id, req.body)
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
  configurations
  .editController(req.user._id, req.params.configId, req.params.controllerId, req.body)
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
  configurations
    .delete(req.user._id, req.params.id)
    .then((result) => {
      res.json(result);
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
