import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const GatewaySchema = new mongoose.Schema({
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
GatewaySchema.method({
});

/**
 * Statics
 */
GatewaySchema.statics = {
  /**
   * Get project
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((gateway) => {
        if (gateway) {
          return gateway;
        }
        const err = new APIError('No such gateway exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
};

/**
 * @typedef Gateway
 */
export default mongoose.model('Project', GatewaySchema);
