const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getRegister = (req, res) => {
    res.render('auth/register', { pageTitle: 'Register' });
}
exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/register', {
                pageTitle: 'Register - Errors',
                errorMessages: errors.array(),
            });
        }
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await user.save();

        // Redirect the user to the login page after logout
        res.redirect('/');
    } catch (err) {
        console.log(err);
        //Display the error message to the user 
        res.render('auth/register', { pageTitle: 'Register', errorMessages: [err.message] });
    }
}
exports.getLogin = (req, res) => {
    res.render('auth/login', { pageTitle: 'Login' });
}
exports.postLogin = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                pageTitle: 'Login - Errors',
                errorMessages: errors.array(),
            });
        }
      // Check if req.user exists and if the user is authenticated
      if (req.session.user && req.session.isLoggedIn) {
        res.redirect('/');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      res.render('auth/login', { pageTitle: 'Login', errorMessages: [err.message] });
    }
  };
  

exports.logout = (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }

        // Redirect the user to the login page after logout
        res.redirect('/');
    });
}