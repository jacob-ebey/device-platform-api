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
 * Create a new configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function add(req, res, next) {
  configurations
    .add(req.user._id, req.body)
    .then((newConfig) => {
      res.json(newConfig);
    })
    .catch(e => next(e));
}

/**
 * Edit a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function edit(req, res, next) {
  configurations
    .edit(req.user._id, req.params.id, req.body)
    .then((newConfig) => {
      res.json(newConfig);
    })
    .catch(e => next(e));
}

/**
 * Remove a configuration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function remove(req, res, next) {
  configurations
    .remove(req.user._id, req.params.id)
    .then((result) => {
      res.json(result);
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
function addDevice(req, res, next) {
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
function removeDevice(req, res, next) {
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
function addController(req, res, next) {
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
function removeController(req, res, next) {
  configurations
    .deleteController(req.user._id, req.params.configId, req.params.controllerId)
    .then((result) => {
      res.json(result);
    })
    .catch(e => next(e));
}

export default {
  get,
  getAll,
  add,
  edit,
  remove,
  addDevice,
  editDevice,
  removeDevice,
  addController,
  editController,
  removeController
};
