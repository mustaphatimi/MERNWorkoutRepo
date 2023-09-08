const express = require('express');
const router = express.Router();
const {
    loginUser,
    signupUser
} = require('../controllers/userController')
const catchAsync = require('../catchAsync')

router.post('/login', catchAsync(loginUser))

router.post('/signup', catchAsync(signupUser))

module.exports = router;