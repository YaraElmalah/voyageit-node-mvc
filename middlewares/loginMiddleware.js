const { body } = require('express-validator');
const User = require('../models/User'); // Replace this with your User model
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison

exports.loginMiddleware = [
    body('login')
        .notEmpty().withMessage('Login field is required')
        .custom(async (value, { req }) => {
            if (value.trim() !== '') {
                // Check if the loginField is an email
                if (value.includes('@')) {
                    // If it's an email, check if it exists in the database
                    const user = await User.findOne({ email: value });
                    if (!user) {
                        return Promise.reject('Email not found');
                    }
                    // Store the found user in the request for later use
                    req.session.user = user;
                } else {
                    // If it's not an email, assume it's a name, and check if it exists in the database
                    const user = await User.findOne({ name: value });
                    if (!user) {
                        return Promise.reject('Name not found');
                    }
                    // Store the found user in the request for later use
                    req.session.user = user;
                }
                // If the loginField exists, it's valid
                return true;
            }
        }),
    body('password')
        .notEmpty().withMessage('Password is required')
        .custom(async (value, { req }) => {
            if (value.trim() !== '') {
                if (!req.session.user) {
                    // If the previous validation failed (loginField not found), skip password comparison
                    return true;
                }

                // Compare the provided password with the crypted password in the database
                const isPasswordMatch = await bcrypt.compare(value, req.session.user.password);
                if (!isPasswordMatch) {
                    return Promise.reject('Incorrect password');
                }

                // If the password matches, it's valid
                req.session.isLoggedIn = true;
                return true;
            }
        })
];
