const { Router } = require('express');
const workoutController = require('../controllers/workoutController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { requireAccess } = require('../middleware/groupMiddleware');

const router = Router();

router.get('/group/:id/workout/create', requireAuth, requireAccess, workoutController.workout_create_get);
router.post('/group/:id/workout/create', requireAuth, requireAccess, workoutController.workout_create_post);
router.get('/group/:id/workout/:workoutid', requireAuth, requireAccess, workoutController.workout_get);
router.post('/group/:id/workout/:workoutid', checkUser, requireAuth, requireAccess, workoutController.workout_post);
router.get('/group/:id/workout/:workoutid/completed', checkUser, requireAuth, requireAccess, workoutController.workout_completed_get);



module.exports = router;