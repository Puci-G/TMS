const router = require('express').Router();
const teamController = require('../controllers/teamController');
const { teamValidation } = require('../middleware/validation');
const auth = require('../middleware/auth');
const role  = require('../middleware/role');   

 router.get('/',  auth,                                      teamController.getTeams);
 router.get('/:id', auth,                                    teamController.getTeamById);
// admins & managers can create / edit / delete
router.post('/',                auth, role('admin','manager'), teamValidation, teamController.createTeam);
router.put('/:id',              auth, teamController.updateTeam);
router.delete('/:id',           auth, role('admin','manager'), teamController.deleteTeam);

// member management (still admins & managers only)
router.post('/:id/members',     auth, teamController.addMember);
router.delete('/:id/members/:userId', auth, role('admin','manager'), teamController.removeMember);

module.exports = router;