const bcrypt = require('bcrypt');
const User = require('../models/user');
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
                pageTitle: 'Register',
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
exports.postLogin = async (req, res) => {
    const { login, password } = req.body;
    try {
        let user;
        if (isEmailFormat(login)) {
            user = await User.findOne({ email: login });
        } else {
            user = await User.findOne({ name: login });
        }

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        // Store user information in the session cookie
        req.session.user = { _id: user._id, name: user.name, email: user.email };
        req.session.isLoggedIn = true;
        res.redirect('/')
    } catch (err) {
        res.status(500).send('Error during login');
    }
}

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