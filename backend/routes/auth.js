const router = require('express').Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', require('../middleware/auth'), authController.getCurrentUser);

module.exports = router;