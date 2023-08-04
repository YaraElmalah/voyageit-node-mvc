// routes/auth.js
const express = require('express');
const authController = require('../controllers/auth');
const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');
const {registerMiddleware} = require('../middlewares/registerMiddleware');
const {loginMiddleware} = require('../middlewares/loginMiddleware');
const router = express.Router();



// User registration
router.get('/register', isGuest,  authController.getRegister);
router.post('/register', isGuest, registerMiddleware, authController.postRegister);
  

// User login
router.get('/login', isGuest, authController.getLogin);
router.post('/login', isGuest, loginMiddleware , authController.postLogin);

// Logout
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;
