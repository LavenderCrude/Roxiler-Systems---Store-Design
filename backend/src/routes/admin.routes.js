const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createUserValidator,
  createStoreValidator,
} = require('../validators/admin.validator');

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', createUserValidator, validate, adminController.createUser);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/stores', createStoreValidator, validate, adminController.createStore);
router.get('/stores', adminController.listStores);

module.exports = router;
