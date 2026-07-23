const { body } = require('express-validator');
const {
  nameRules,
  emailRules,
  addressRules,
  passwordRules,
} = require('./auth.validator');

const createUserValidator = [
  nameRules,
  emailRules,
  addressRules,
  passwordRules,
  body('role')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be ADMIN, USER, or STORE_OWNER'),
];

const createStoreValidator = [
  body('name').trim().notEmpty().withMessage('Store name is required'),
  emailRules,
  addressRules,
  body('ownerId')
    .isInt({ min: 1 })
    .withMessage('A valid store owner ID is required'),
];

const ratingValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

module.exports = {
  createUserValidator,
  createStoreValidator,
  ratingValidator,
};
