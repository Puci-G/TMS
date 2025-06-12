const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 50 },
  description: { type: String, maxlength: 500 },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['leader', 'member'], default: 'member' },
  }],
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

teamSchema.virtual('memberCount').get(function() { return this.members.length; });

teamSchema.index({ name: 1 });
teamSchema.index({ leader: 1 });

module.exports = mongoose.model('Team', teamSchema);