const { body } = require('express-validator'); //we call a subpackage
const User = require('../models/user');

exports.registerValidations =

[
    body('email')
      .exists({ checkFalsy: true }).withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email')
      .custom((value) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('We already have a user with this email');
          }
          return true;
        });
      })
      .normalizeEmail(),
    body('name')
      .exists({ checkFalsy: true }).withMessage('Name is required')
      .custom((value) => {
        return User.findOne({ name: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('We already have a user with this name');
          }
          return true;
        });
      })
      .trim(),
    body('password')
      .exists({ checkFalsy: true }).withMessage('Password is required')
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password should contain letters, numbers, and special characters')
  ];