const { body} = require('express-validator');
const User = require('../models/User');

exports.registerMiddleware = [
  body('email')
    .exists({ checkFalsy: true }).withMessage('Email is required')
    .bail() // Stop validation if the field is empty
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
    .bail() // Stop validation if the field is empty
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
