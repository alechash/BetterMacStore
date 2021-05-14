const User = require('../models/User');
const Company = require('../models/Company');
const Application = require('../models/Application');
require('dotenv').config()
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport')
const Name = process.env.NAME
const funcs = require('../config/functions');
const validator = require('validator');
const csrf = require('csurf')
const rl = require('../config/rateLimit')

const csrfProtection = csrf({
    cookie: true
})

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

router.get('/', async function (req, res, next) {
    // going to a companies profile at /dev/:name

    about.title = 'Developer Docs'
    about.template = 'docs/index'

    return res.render('base', about);
});

module.exports = router;