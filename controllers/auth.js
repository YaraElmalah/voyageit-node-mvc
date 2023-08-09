// Import necessary modules
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Render the registration page
exports.getRegister = (req, res) => {
    res.render('auth/register', { pageTitle: 'Register' });
}
// Handle user registration
exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Validate user input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/register', {
                pageTitle: 'Register - Errors',
                errorMessages: errors.array(),
            });
        }
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });
        // Save the user to the database
        await user.save();

        // Redirect the user to the login page after registration
        res.redirect('/');
    } catch (err) {
        // Log the error and display the error message to the user
        console.log(err);
        res.render('auth/register', { pageTitle: 'Register', errorMessages: [err.message] });
    }
}
// Render the login page
exports.getLogin = (req, res) => {
    res.render('auth/login', { pageTitle: 'Login' });
}
// Handle user login
exports.postLogin = (req, res) => {
    try {
        // Validate user input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                pageTitle: 'Login - Errors',
                errorMessages: errors.array(),
            });
        }
      // Check if req.user exists and if the user is authenticated
      if (req.session.user && req.session.isLoggedIn) {
        // Redirect the user to the home page if they are already logged in
        res.redirect('/');
      } else {
        // Throw an error if the email or password is invalid
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      // Log the error and display the error message to the user
      res.render('auth/login', { pageTitle: 'Login', errorMessages: [err.message] });
    }
  };
  

// Handle user logout
exports.logout = (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            // Log the error and send an error message
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }

        // Redirect the user to the login page after logout
        res.redirect('/');
    });
}