const router = require('express').Router();
const projectController = require('../controllers/projectController');
const { projectValidation } = require('../middleware/validation');
const auth = require('../middleware/auth');
const role  = require('../middleware/role');

router.get('/', auth, projectController.getProjects);
router.get('/:id', auth, projectController.getProjectById);
router.post('/',    auth, role('admin','manager'), projectValidation, projectController.createProject);
router.put('/:id',  auth, role('admin','manager'), projectController.updateProject);
router.delete('/:id',auth, role('admin','manager'), projectController.deleteProject);

module.exports = router;