const User = require('../models/User');
require('dotenv').config()
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport')
const Name = process.env.NAME
const funcs = require('../config/functions');

var about = {}
router.get('/*', async function (req, res, next) {
    // add language variables to EJS file
    about = funcs.language(req.user)

    // define some defaults for the EJS files
    about.name = Name
    about.path = req.path
    about.loggedin = await funcs.loggedin(req.user)
    about.staff = funcs.staff(req.user)
    about.user = req.user
    about.navbar = true
    about.footer = true
    about.analytics = process.env.ANALYTICS
    about.ga = process.env.GA_CODE

    next()
});

router.get('/', function (req, res, next) {
    about.title = 'Home'
    about.template = 'main/index'

    return res.render('base', about);
});

router.get('/donate', function (req, res, next) {
    about.title = 'Donate'
    about.template = 'main/donate'

    return res.render('base', about);
});

module.exports = router;