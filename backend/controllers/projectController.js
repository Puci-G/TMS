const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get projects (with pagination, optional team filter)
exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.team) filter.team = req.query.team;

    const projects = await Project.find(filter)
      .populate('team', 'name')
      .populate('assignedTo', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.json({ success: true, projects, pagination: { current: page, total: Math.ceil(total / limit), count: projects.length, totalCount: total } });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team', 'name')
      .populate('assignedTo', 'username firstName lastName');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    console.error('Get project by ID error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { title, description, team, deadline, priority, tags = [] } = req.body;

    const teamDoc = await Team.findById(team);
    if (!teamDoc) return res.status(400).json({ success: false, message: 'Team not found' });

    const project = await Project.create({ title, description, team, deadline, priority, tags, createdBy: req.user.userId });

    const populated = await Project.findById(project._id).populate('team', 'name');

    res.status(201).json({ success: true, project: populated });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, progress, assignedTo } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (deadline) project.deadline = deadline;
    if (typeof progress === 'number') project.progress = progress;
    if (assignedTo) project.assignedTo = assignedTo;

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};