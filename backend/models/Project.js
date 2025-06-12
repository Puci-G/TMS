const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100, trim: true },
  description: { type: String, required: true, maxlength: 1000 },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['planning', 'in-progress', 'review', 'completed', 'cancelled'], default: 'planning' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  startDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  completedAt: Date,
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  progress: { type: Number, min: 0, max: 100, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

projectSchema.virtual('daysUntilDeadline').get(function() {
  const diff = this.deadline - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

projectSchema.virtual('isOverdue').get(function() {
  return new Date() > this.deadline && this.status !== 'completed';
});

projectSchema.index({ team: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ deadline: 1 });

module.exports = mongoose.model('Project', projectSchema);