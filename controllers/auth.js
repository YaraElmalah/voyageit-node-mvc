const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isEmailFormat } = require('../util/formHelpers');

exports.getRegister = (req, res) => {
    res.render('auth/register', { pageTitle: 'Register' });
}
exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await user.save();
        console.log('User registered successfully');
        return res.status(201).render('index', {
            pageTitle: 'VoyageIt',
            isAuthenticated: true,
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error registering user');
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
        res.send('Login successful');
    } catch (err) {
        res.status(500).send('Error during login');
    }
}

exports.logout = (req, res) => {
    // Clear the session cookie to log the user out
    req.session = null;
    res.send('Logged out successfully');
}