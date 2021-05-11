const User = require('../models/User');
require('dotenv').config()
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport')
const Name = process.env.NAME
const funcs = require('../config/functions');
const Application = require('../models/Application');

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
    about.title = 'Home'
    about.template = 'main/index'

    return res.render('base', about);
});

router.get('/donate', function (req, res, next) {
    about.title = 'Donate'
    about.template = 'main/donate'

    return res.render('base', about);
});

router.get('/search', async function (req, res, next) {
    const query = req.query.q
    const page = Number(req.query.p ? req.query.p : '0') + 1
    const skip = (page - 1) * 100

    const search = await Application.find({
            $text: {
                $search: query,
                $caseSensitive: false
            }
        }, {
            score: {
                $meta: "textScore"
            }
        })
        .skip(skip)
        .limit(20)

    about.title = 'Search - ' + query
    about.template = 'main/search'
    about.apps = search
    about.search = query
    about.page = page

    return res.render('base', about);
});

module.exports = router;