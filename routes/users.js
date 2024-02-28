const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');

// user controller
const users = require('../controllers/users');

const { storeReturnTo,isLoggedIn } = require('../middlewares');

router.route('/register')
    // rendering register form
    .get(users.renderRegister)

    // creating user 
    .post(catchAsync(users.register));

router.route('/login')
    // rendering login form
    .get(users.renderLogin)

    // logging in using login form information
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.login))

// logging out 
router.get('/logout', isLoggedIn, users.logout);

module.exports = router;