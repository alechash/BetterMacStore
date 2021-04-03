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
    var userLanguage;
    if (req.user) {
        userLanguage = req.user.personal.language
    } else {
        userLanguage = 'english'
    }

    const languageFile = require(`../translations/${userLanguage}`)

    about = languageFile
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
    const myOrgs = req.user.developer.organizations
    const org = req.body.org
    const name = req.body.name
    const description = req.body.description
    const appId = Math.floor(1000000 + Math.random() * 9000000)

    myOrgs.push('me')

    if (!myOrgs.includes(org)) {
        return res.send('Error: you are not part of the ' + org + ' organization<br><br>Tip: you can just press the back button and the input fields will have your inputed data ;)')
    }

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
            developer: org,
            org: organization,
            name: name,
            description: description,
            creationDate: Date.now()
        },
        unique: {
            appId: appId
        }
    })

    const version = req.body.version
    const releaseTitle = req.body.title
    const releaseNotes = req.body.notes

    const newRelease = new Release({
        app: appId,
        version: version,
        description: releaseNotes,
        title: releaseTitle,
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
        app: appId,
        type: 'icon',
        creationDate: Date.now(),
        url: req.files.icon.tempFilePath
    })

    newIcon.save()

    for (i = 0; i < req.files.screenshots.length; i++) {
        const newImage = new Image({
            app: appId,
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