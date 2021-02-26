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

    next()
});

router.get('/new', async function (req, res, next) {
    about.title = 'Release an App'
    about.template = 'app/new'

    return res.render('base', about);
})

router.get('/:id', function (req, res, next) {
    about.title = 'Home'
    about.template = 'main/index'

    return res.render('base', about);
});

module.exports = router;