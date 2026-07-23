const express = require('express');
const storeOwnerController = require('../controllers/storeOwner.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', storeOwnerController.getDashboard);
router.get('/ratings', storeOwnerController.listRatings);

module.exports = router;
