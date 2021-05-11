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
    about = funcs.language(req.user, req.cookies.language)

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
    // if no user, redirect to login page
    funcs.needLoggedin(req.user, res, next)

    next()
});

router.get('/settings', function (req, res, next) {
    // if no user, redirect to login page
    funcs.needLoggedin(req.user, res, next)

    const user = req.user

    about.user = user
    about.title = 'Settings'
    about.template = 'account/settings'

    return res.render('base', about);
});

router.get('/settings/developer/toggle', function (req, res, next) {
    // if no user, redirect to login page
    funcs.needLoggedin(req.user, res, next)

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
    // if no user, redirect to login page
    funcs.needLoggedin(req.user, res, next)

    // confirm that the user wants to toggle the developer access

    const user = req.user

    const updateUser = await User.findByIdAndUpdate(user._id, {
        // make the boolean the opposite of what it was
        'developer.developerEnabled': !user.developer.developerEnabled
    })

    // save the updates
    updateUser

    return res.redirect('/account/settings')
});

router.post('/settings/language', async function (req, res, next) {
    // although this is an account route, if the user isnt logged in, we dont
    // want to force them to signup to view the site in their own language
    const loggedin = funcs.loggedin(req.user)

    if (loggedin == true) {
        const user = req.user
        const language = funcs.changeLanguage(req.body.language)

        const updateUser = await User.findByIdAndUpdate(user._id, {
            // make the boolean the opposite of what it was
            'personal.language': language
        })

        // save the updates
        updateUser
    } else {
        res.cookie('language', funcs.changeLanguage(req.body.language), {
            expires: new Date(Date.now() + 90000000000),
            httpOnly: true
        })
    }

    return res.redirect('/')
});

module.exports = router;