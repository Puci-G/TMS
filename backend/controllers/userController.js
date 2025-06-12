const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get users with pagination
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).select('-password').sort({ createdAt: -1 });
    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: { current: page, total: Math.ceil(total / limit), count: users.length, totalCount: total },
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('teams', 'name description');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, role, isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role && req.user.role === 'admin') user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Promote / demote – admins only
exports.updateRole = async (req, res) => {
  const { role } = req.body;                           // 'admin' | 'manager' | 'member'
  if (!['admin','manager','member'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new:true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ success:true, user });
};