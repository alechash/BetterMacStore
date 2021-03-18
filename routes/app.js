const User = require('../models/User');
const Application = require('../models/Application');
const Release = require('../models/ReleaseNotes');
const Image = require('../models/Image');
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

router.post('/new', async function (req, res, next) {
    organization = true

    if (!req.user.developer.organizations.includes(req.body.org) || !req.body.org == 'me') {
        return res.redirect('/app/new')
    }

    if (req.body.org == 'me') {
        req.body.org = req.user._id
        organization = false
    }

    const newApp = new Application({
        meta: {
            developer: req.body.org,
            org: organization,
            name: req.body.name,
            description: req.body.description,
            creationDate: Date.now(),
            name: req.body.name
        },
        unique: {
            appId: Math.floor(1000000 + Math.random() * 9000000)
        }
    })

    const newRelease = new Release({
        app: newApp.unique.appId,
        version: req.body.version,
        description: req.body.notes,
        title: req.body.title,
        creationDate: Date.now(),
        binaries: {
            app: req.files.app.tempFilePath,
            zip: req.files.zip.tempFilePath
        },
    })

    if (req.files.dmg) {
        newRelease.binaries.dmg = req.files.dmg.tempFilePath
    }

    const newIcon = new Image({
        app: newApp.unique.appId,
        type: 'icon',
        creationDate: Date.now(),
        url: req.files.icon.tempFilePath
    })

    newIcon.save()

    for (i = 0; i < req.files.screenshots.length; i++) {
        const newImage = new Image({
            app: newApp.unique.appId,
            type: 'screenshot',
            creationDate: Date.now(),
            url: req.files.screenshots[i].tempFilePath
        })

        newImage.save()
    }

    newApp.meta.latestRelease = newRelease._id

    newRelease.save().then(release => {
        newApp.save().then(app => {
            return res.redirect('/app/' + app.unique.appId)
        })
    })
})

router.get('/:id', async function (req, res, next) {
    const app = await Application.findOne({
        'unique.appId': req.params.id
    })

    const releases = await Release.find({
        app: req.params.id
    })

    const icon = await Image.findOne({
        app: req.params.id,
        type: 'icon'
    })

    const screenshots = await Image.find({
        app: req.params.id,
        type: 'screenshot'
    })

    about.title = app.meta.name
    about.app = app
    about.icon = icon
    about.screenshots = screenshots
    about.releases = releases
    about.template = 'app/app'

    return res.render('base', about);
});

module.exports = router;