import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ownedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: []
  }],
  sharedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: []
  }],
  ownedGateways: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gateway',
    default: []
  }],
  sharedGateways: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gateway',
    default: []
  }],
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// eslint-disable-next-line func-names, prefer-arrow-callback
UserSchema.pre('save', function (next) {
  const self = this;

  if (!self.isModified('password')) {
    next();
    return;
  }

  bcrypt.hash(self.password, 16.5, (error, hash) => {
    console.log(error);
    console.log(hash);
    if (error) {
      next(error);
      return;
    }

    self.password = hash;
    next();
  });
});

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getProjects(id, callback) {
    this.findById(id)
      .populate('ownedProjects sharedProjects')
      .exec((err, result) => {
        callback(err, err ? null : [...result.ownedProjects, ...result.sharedProjects]);
      });
  },

  getGateways(id, callback) {
    this.findById(id)
      .populate('ownedGateways sharedGateways')
      .exec((err, result) => {
        callback(err, err ? null : [...result.ownedGateways, ...result.sharedGateways]);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
