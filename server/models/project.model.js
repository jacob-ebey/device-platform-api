import mongoose from 'mongoose';

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
};

/**
 * @typedef Project
 */
export default mongoose.model('Project', ProjectSchema);
