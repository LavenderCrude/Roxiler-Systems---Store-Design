const { body } = require('express-validator');

const nameRules = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRules = body('email')
  .trim()
  .isEmail()
  .withMessage('Must be a valid email address')
  .normalizeEmail();

const addressRules = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
  .withMessage('Password must contain at least one special character');

const registerValidator = [
  nameRules,
  emailRules,
  addressRules,
  passwordRules,
];

const loginValidator = [
  emailRules,
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
    .withMessage('Password must contain at least one special character'),
];

module.exports = {
  nameRules,
  emailRules,
  addressRules,
  passwordRules,
  registerValidator,
  loginValidator,
  changePasswordValidator,
};
