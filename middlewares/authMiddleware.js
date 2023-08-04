const { body } = require('express-validator'); //we call a subpackage
const User = require('../models/user');
// Middleware to check if the user is logged in
exports.isGuest = (req, res, next) => {
    // Check if the user is authenticated 
    if (!req.session || !req.session.isLoggedIn) {
        return next();
    } else {
        res.redirect('/');
    }
}

exports.isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated 
    if (req.session && req.session.isLoggedIn) {
        return next();
    } else {
        res.redirect('/');
    }
}


exports.isLoggedIn = (req) => {
    if (req.session && req.session.isLoggedIn) {
        return true;
    } else {
        return false;
    }
}

exports.registerValidation = [
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email').custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
            return Promise.reject('We already have a user with this email');
        }
    });
}).normalizeEmail(), //make it normalized as it has no capitalize characters or something
body('name').notEmpty().withMessage('Name is required').custom((value, { req }) => {
    return User.findOne({ name: value }).then(userDoc => {
        if (userDoc) {
            return Promise.reject('We already have a user with this name');
        }
    });
}).trim(),
body('password').notEmpty().withMessage('Password is required').custom((value, { req }) => {
    // For example, to check if the password is at least 8 characters long and contains letters, numbers, and special characters:
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value) || value.length < 8) {
        throw new Error('Please enter a valid password, minimum 8 characters long, containing letters, numbers, and special characters');
    }
   return true;
  }).trim()];
