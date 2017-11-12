import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const ProjectSchema = new mongoose.Schema({
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
  gateways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gateway' }],
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
ProjectSchema.method({
});

/**
 * Statics
 */
ProjectSchema.statics = {
  /**
   * Get project
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('ownedBy', 'username')
      .populate('gateways')
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
 * @typedef Project
 */
export default mongoose.model('Project', ProjectSchema);
