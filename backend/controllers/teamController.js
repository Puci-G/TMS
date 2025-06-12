const Team = require('../models/Team');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all teams with pagination
exports.getTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teams = await Team.find({ status: { $ne: 'archived' } })
      .populate('leader', 'username firstName lastName email')
      .populate('members.user', 'username firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Team.countDocuments({ status: { $ne: 'archived' } });

    res.json({ success: true, teams, pagination: { current: page, total: Math.ceil(total / limit), count: teams.length, totalCount: total } });
  } catch (err) {
    console.error('Get teams error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'username firstName lastName email role')
      .populate('members.user', 'username firstName lastName email role')
      .populate('projects', 'title description status priority deadline');

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, team });
  } catch (err) {
    console.error('Get team by ID error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, description, leaderId, memberIds = [] } = req.body;

    const exists = await Team.findOne({ name });
    if (exists) return res.status(400).json({ success: false, message: 'Team name already taken' });

    const leader = await User.findById(leaderId);
    if (!leader) return res.status(400).json({ success: false, message: 'Leader not found' });

    const members = [{
      user: leaderId,
      role: 'leader',
      joinedAt: new Date(),
    }];

    for (const m of memberIds) {
      if (m !== leaderId) members.push({ user: m, role: 'member', joinedAt: new Date() });
    }

    const team = await Team.create({ name, description, leader: leaderId, members, createdBy: req.user.userId });

    await User.updateMany({ _id: { $in: members.map(m => m.user) } }, { $push: { teams: team._id } });

    const populated = await Team.findById(team._id).populate('leader', 'username firstName lastName email').populate('members.user', 'username firstName lastName email');

    res.status(201).json({ success: true, team: populated });
  } catch (err) {
    console.error('Create team error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (name) team.name = name;
    if (description) team.description = description;
    if (status) team.status = status;

    await team.save();
    res.json({ success: true, team });
  } catch (err) {
    console.error('Update team error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add member
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (team.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ success: false, message: 'User already a member' });
    }

    team.members.push({ user: userId, role: 'member', joinedAt: new Date() });
    await team.save();
    await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });

    res.json({ success: true, team });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove member
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    team.members = team.members.filter(m => m.user.toString() !== userId);
    await team.save();
    await User.findByIdAndUpdate(userId, { $pull: { teams: team._id } });

    res.json({ success: true, team });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });

    res.json({ success: true, message: 'Team deleted' });
  } catch (err) {
    console.error('Delete team error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};