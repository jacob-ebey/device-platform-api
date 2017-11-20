import mongoose from 'mongoose';

/**
 * Gateway Log Schema
 */
const GatewayLogSchema = new mongoose.Schema({
  gatewayId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  offset: {
    type: Date,
    required: true
  },
  message: {
    type: Object
  }
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
GatewayLogSchema.method({
});

/**
 * Statics
 */
GatewayLogSchema.statics = {
  /**
   * Get project
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<GatewayLog>}
   */
  get(gatewayId) {
    return this
      .find({ gatewayId, message: { $ne: null } })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  },

  lastLog() {
    return this
      .findOne({}, {}, { sort: { createdAt: -1 } })
      .exec();
  }
};

/**
 * @typedef GatewayLog
 */
export default mongoose.model('GatewayLog', GatewayLogSchema);
