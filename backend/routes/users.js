const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.delete('/:id', auth, role('admin','manager'), userController.deleteUser);
router.get('/', auth, role('admin','manager'), userController.getUsers);
router.get('/:id', auth, role('admin','manager'), userController.getUserById);
router.put('/:id', auth, role('admin','manager'), userController.updateUser);
router.put('/:id/role', auth, role('admin'), userController.updateRole);

module.exports = router;