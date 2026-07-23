const express = require('express');
const storeController = require('../controllers/store.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { ratingValidator } = require('../validators/admin.validator');

const router = express.Router();

router.use(authenticate, authorize('USER'));

router.get('/', storeController.listStores);
router.post('/:id/ratings', ratingValidator, validate, storeController.submitRating);
router.put('/:id/ratings', ratingValidator, validate, storeController.updateRating);

module.exports = router;
