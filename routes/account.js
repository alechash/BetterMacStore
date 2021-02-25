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
    about.name = Name
    about.path = req.path
    about.loggedin = await funcs.loggedin(req.user)
    about.staff = funcs.staff(req.user)
    about.user = req.user
    about.navbar = true
    about.footer = true
    about.analytics = process.env.ANALYTICS
    about.ga = process.env.GA_CODE

    if (funcs.loggedin(req.user) == true) {
        next()
    } else {
        return res.redirect('/login')
    }
});

router.get('/', function (req, res, next) {
    next()
});

router.get('/settings', function (req, res, next) {
    const user = req.user

    about.user = user
    about.title = 'Settings'
    about.template = 'account/settings'

    return res.render('base', about);
});

router.get('/settings/developer/toggle', function (req, res, next) {
    const user = req.user

    about.user = user
    about.title = 'Toggle Developer Access'
    about.navbar = false
    about.footer = false
    about.enabled = req.user.developer.developerEnabled
    about.template = 'account/developer/toggle'

    return res.render('base', about);
});

router.get('/settings/developer/toggle/confirm', async function (req, res, next) {
    const user = req.user

    const updateUser = await User.findByIdAndUpdate(user._id, {
        'developer.developerEnabled': !user.developer.developerEnabled
    })
    updateUser

    return res.redirect('/account/settings')
});

module.exports = router;