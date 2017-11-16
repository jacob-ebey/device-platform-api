import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Device Configuration Schema
 */
export const DeviceConfigurationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  defaultValue: {
    type: Number
  }
});

/**
 * Device Configuration
 */
export const DeviceConfiguration = mongoose.model('DeviceConfiguration', DeviceConfigurationSchema);

/**
 * Schedule Configuration Schema
 */
const ScheduleConfigurationSchema = new mongoose.Schema({
  dateTime: String,
  actuators: [{
    type: Number,
    default: []
  }],
  actuatorStates: [{
    type: Number,
    default: []
  }]
});

/**
 * Controller Configuration Schema
 */
export const ControllerConfigurationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  inputs: [{
    type: String,
    default: []
  }],
  outputs: [{
    type: String,
    default: []
  }],
  schedule: [{
    type: ScheduleConfigurationSchema,
    default: []
  }]
});

/**
 * Controller Configuration
 */
export const ControllerConfiguration = mongoose.model('ControllerConfiguration', ControllerConfigurationSchema);

/**
 * Configuration Schema
 */
const ConfigurationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ownedBy: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceConfiguration',
    default: []
  }],
  controllers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ControllerConfiguration',
    default: []
  }]
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ConfigurationSchema.method({
});

/**
 * Statics
 */
ConfigurationSchema.statics = {
  /**
   * Get project
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('ownedBy', 'username')
      .populate('devices')
      .populate('controllers')
      .exec()
      .then((project) => {
        if (project) {
          return project;
        }
        const err = new APIError('No such project exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef Configuration
 */
export default mongoose.model('Configuration', ConfigurationSchema);
