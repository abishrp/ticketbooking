const express = require('express');
const router = new express.Router();
const registerController = require('../controllers/userController/registerController')
const loginController = require("../controllers/userController/loginController")
const authController= require("../controllers/userController/authController")

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/verify', authController.verifyToken);
router.post('/otp', registerController.verifyOtpAndRegister);


module.exports = router