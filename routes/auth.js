// routes/auth.js
const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();


// User registration
router.get('/auth/register', authController.getRegister);
router.post('/register', authController.postRegister);

// User login
router.get('/auth/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
