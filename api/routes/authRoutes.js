const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', authController.Signup);
router.post('/login', authController.Login);

module.exports = router;