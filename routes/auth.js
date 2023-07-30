// routes/auth.js
const express = require('express');
const authController = require('../controllers/auth');
const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();


// User registration
router.get('/register', isGuest, authController.getRegister);
router.post('/register', isGuest, authController.postRegister);

// User login
router.get('/login', isGuest, authController.getLogin);
router.post('/login', isGuest, authController.postLogin);

// Logout
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;
