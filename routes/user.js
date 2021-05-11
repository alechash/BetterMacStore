const User = require('../models/User');
require('dotenv').config()
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport')
const Name = process.env.NAME
const funcs = require('../config/functions');
const {
    v4: uuidv4
} = require('uuid');
const url = require('url');
const emailValid = require('node-email-validation');
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

router.get('/signup', csrfProtection, function (req, res, next) {
    var error = req.query.error

    about.title = 'Signup'
    about.template = 'main/signup'
    about.error = error
    about.csrf = req.csrfToken()

    return res.render('base', about);
});

router.post('/signup', csrfProtection, rl.min_1, (req, res) => {
    // recieve user inputed data from signup field
    const {
        email,
        password,
        password2,
        name
    } = req.body;

    if (emailValid.is_email_valid(email)) {} else {
        return res.send('Error: email is not an email')
    }

    // if there is any missing data, throw error
    if (!email || !password || !password2) {
        return '{"type": "error", "message": "Please fill out all fields."}'
    }

    // if passwords dont match
    if (password != password2) {
        return res.redirect(url.format({
            pathname: "/signup",
            query: {
                "error": "Passwords are not the same."
            }
        }))
    }

    // if  password length is less than eight
    if (password.length < 8) {
        return res.redirect(url.format({
            pathname: "/signup",
            query: {
                "error": "Your password needs to be at least 8 characters long."
            }
        }))
    }

    // find if user already exists
    User.findOne({
        'personal.email': email
    }).then(user => {
        if (user) {
            // if user exists, cancel the signup
            return res.redirect(url.format({
                pathname: "/signup",
                query: {
                    "error": "That email is already in use."
                }
            }))
        } else {
            // else create a new user
            const newUser = new User({
                'personal.email': email,
                'personal.password': password,
                'meta.staff': false,
                'meta.creationDate': Date.now(),
            });

            // encrypt the password user 10 gen salt hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.personal.password, salt, (err, hash) => {
                    newUser.personal.password = hash;
                    newUser
                        .save()
                        .then(async user => {
                            res.redirect('/login?success=true');
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    })
});

router.get('/login', csrfProtection, function (req, res, next) {
    // if the user is already logged in, redirect to home page
    if (req.user) {
        return res.redirect('/');
    }

    var errormessage

    if (req.query.error != undefined) {
        errormessage = req.query.error
    }

    about.title = 'Login'
    about.template = 'main/login'
    about.error = errormessage
    about.csrf = req.csrfToken()

    return res.render('base', about);
});

router.post('/login', csrfProtection, rl.min_1, async function (req, res, next) {
    try {
        // try and authenticate the user, redirect depending on outcome
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
        })(req, res, next);
    } catch (err) {
        // catch the error and tell the user
        res.redirect(url.format({
            pathname: "/login",
            query: {
                "error": "There was an error logging you in, please try again."
            }
        }))
    }
});

router.get('/logout', (req, res) => {
    // log the user out
    req.logout();

    res.redirect('/login');
});

module.exports = router;