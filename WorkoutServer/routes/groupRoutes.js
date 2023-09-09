const { Router } = require('express');
const groupController = require('../controllers/groupController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAccess } = require('../middleware/groupMiddleware');

const router = Router();


router.get('/group', requireAuth, groupController.group_get);
router.get('/group/create', requireAuth, groupController.group_create_get);
router.post('/group/create', requireAuth, groupController.group_create_post);
router.get('/group/:id', requireAuth, requireAccess, groupController.group_details_get);
router.get('/group/:id/top', requireAuth, requireAccess, groupController.group_top_get);


module.exports = router;