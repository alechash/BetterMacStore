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
const he = require('he');
const wasabi = require('../config/wasabi')
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

router.get('/new', csrfProtection, async function (req, res, next) {
    // if no user, redirect to login page
    funcs.needLoggedin(req.user, res, next)

    about.title = 'Release an App'
    about.template = 'app/new'
    about.csrf = req.csrfToken()

    return res.render('base', about);
})

router.post('/new', csrfProtection, rl.min_1, async function (req, res, next) {
    // if no user, redirect to login page
    funcs.needLoggedin(req.user, res, next)

    // get data from the request body
    const myOrgs = req.user.developer.organizations
    const org = req.body.org
    const name = req.body.name
    const description = req.body.description
    const tags = req.body.tags.split(',').map(Function.prototype.call, String.prototype.trim)
    const category = req.body.category
    const appId = Math.floor(1000000 + Math.random() * 9000000)

    const wasabiAppFile = wasabi.uploadFile(req.files.app.tempFilePath)
    const wasabiZipFile = wasabi.uploadFile(req.files.zip.tempFilePath)

    // BEGIN: check to see if user has access to the organization the app will be made for
    myOrgs.push('me')

    if (!myOrgs.includes(org)) {
        return res.send('Error: you are not part of the ' + he.encode(org) + ' organization<br><br>Tip: you can just press the back button and the input fields will have your inputed data ;)')
    }
    // END: check to see if user has access to the organization the app will be made for

    // BEGIN: see if the app is made for an organization or personal account
    organization = true

    if (!req.user.developer.organizations.includes(req.body.org) || !req.body.org == 'me') {
        return res.redirect('/app/new')
    }

    if (req.body.org == 'me') {
        req.body.org = req.user._id
        organization = false
    }
    // END: see if the app is made for an organization or personal account

    // create a new application template
    const newApp = new Application({
        meta: {
            developer: org,
            org: organization,
            name: name,
            description: description,
            creationDate: Date.now(),
            tags: tags,
            category: funcs.categoryName(category)
        },
        unique: {
            appId: appId
        }
    })

    // this will be the initial release for the app
    // recieve more data from request body
    const version = req.body.version
    const releaseTitle = req.body.title
    const releaseNotes = req.body.notes

    // create a new release template
    const newRelease = new Release({
        app: appId,
        version: version,
        description: releaseNotes,
        title: releaseTitle,
        creationDate: Date.now(),
        binaries: {
            app: wasabiAppFile,
            zip: wasabiZipFile
        },
    })

    // check if a dmg was uploaded
    if (req.files.dmg) {
        const wasabiDmgFile = wasabi.uploadFile(req.files.dmg.tempFilePath)

        // if so, add it to the template
        newRelease.binaries.dmg = wasabiDmgFile
    }

    // create new app icon template
    const newIcon = new Image({
        app: appId,
        type: 'icon',
        creationDate: Date.now(),
        url: req.files.icon.tempFilePath
    })

    // save the icon
    newIcon.save()

    // for each screenshot uploaded, create a new object in the database
    for (i = 0; i < req.files.screenshots.length; i++) {
        const newImage = new Image({
            app: appId,
            type: 'screenshot',
            creationDate: Date.now(),
            url: req.files.screenshots[i].tempFilePath
        })

        newImage.save()
    }

    // update the latest release info
    newApp.meta.latestRelease = newRelease._id

    newRelease.save().then(release => {
        newApp.save().then(app => {
            return res.redirect('/app/' + app.unique.appId)
        })
    })
})

router.get('/:id', async function (req, res, next) {
    // finds the apps homepage

    return res.send('Hi')

    // find the actual app data
    const app = await Application.findOne({
        'unique.appId': req.params.id
    })

    // find all the releases for the app
    const releases = await Release.find({
        app: req.params.id
    })

    // finds the icon for the app
    const icon = await Image.findOne({
        app: req.params.id,
        type: 'icon'
    })

    // finds the screenshots for the app
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