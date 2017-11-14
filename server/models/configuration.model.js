import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Device configuration Schema
 */
export const DeviceConfigurationSchema = new mongoose.Schema({
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
 * Schedule configuration Schema
 */
const ScheduleConfigurationSchema = new mongoose.Schema({
  dateTime: Number,
  actuators: [{
    type: Number,
    default: []
  }]
});

/**
 * Controller configuration Schema
 */
export const ControllerConfigurationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  inputs: [{
    type: Number,
    default: []
  }],
  outputs: [{
    type: Number,
    default: []
  }],
  schedule: ScheduleConfigurationSchema
});

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
    type: DeviceConfigurationSchema,
    default: []
  }],
  controllers: [{
    type: ControllerConfigurationSchema,
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
      .exec()
      .then((project) => {
        if (project) {
          return project;
        }
        const err = new APIError('No such project exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
};

/**
 * @typedef Configuration
 */
export default mongoose.model('Configuration', ConfigurationSchema);
