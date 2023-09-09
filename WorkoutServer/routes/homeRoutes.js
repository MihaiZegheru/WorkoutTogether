const { Router } = require('express');
const homeController = require('../controllers/homeController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', requireAuth, homeController.home_get);

module.exports = router;