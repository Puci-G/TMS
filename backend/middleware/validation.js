const { body } = require('express-validator');

exports.registerValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username min 3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

exports.teamValidation = [
  body('name').notEmpty().withMessage('Team name required'),
  body('leaderId').notEmpty().withMessage('Leader ID required'),
];

exports.projectValidation = [
  body('title').notEmpty().withMessage('Project title required'),
  body('description').notEmpty().withMessage('Project description required'),
  body('team').notEmpty().withMessage('Team ID required'),
  body('deadline').isISO8601().toDate().withMessage('Valid deadline required'),
];