const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const authcontroller = require('../controllers/authcontroller');
//const LocalStrategy = require('passport-local');

router.route('/register')
    .get(authcontroller.renderRegister)
    .post(catchAsync(authcontroller.register));

router.route('/login')
    .get(authcontroller.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), authcontroller.login);

router.get('/logout', authcontroller.logout);

module.exports = router;