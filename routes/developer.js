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

router.get('/new', function (req, res, next) {
    if (!funcs.loggedin(req.user)) {
        return res.redirect('/login')
    }

    about.title = 'Create Developer Organization'
    about.template = 'developer/new'

    return res.render('base', about);
});

router.post('/new', async function (req, res, next) {
    if (!funcs.loggedin(req.user)) {
        return res.redirect('/login')
    }

    const name = req.body.name;
    const legalName = req.body.legal
    const email = req.body.email
    const phone = req.body.phone
    const website = req.body.website
    const twitter = req.body.twitter
    const location = req.body.location
    const apple = req.body.apple
    const android = req.body.android
    const microsoft = req.body.microsoft

    const newCompany = new Company({
        'general.name': name.toLowerCase(),
        'general.legalName': legalName,
        'general.email': email,
        'general.phone': phone,

        'meta.creationDate': Date.now(),
        'meta.verified': false,
        'meta.members': [req.user._id],

        'other.website': website,
        'other.twitter': twitter.replace('@', ''),
        'other.location': location,

        'stores.apple': apple,
        'stores.android': android,
        'stores.microsoft': microsoft,
    })

    req.user.developer.organizations.push(name.toLowerCase())

    const addUserToCompany = await User.findOneAndUpdate({
        _id: req.user._id
    }, {
        'developer.organizations': req.user.developer.organizations
    })

    addUserToCompany

    newCompany.save().then(company => {
        return res.redirect(`/dev/${company.general.name}`)
    })
});

router.get('/:name', async function (req, res, next) {
    about.title = req.params.name
    about.template = 'developer/company'
    about.company = await Company.findOne({
        'general.name': req.params.name
    })

    about.apps = await Application.find({
        'meta.developer': req.params.name
    })

    return res.render('base', about);
});

module.exports = router;