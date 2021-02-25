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

router.get('/signup', function (req, res, next) {
    var error = req.query.error

    about.title = 'Signup'
    about.template = 'main/signup'
    about.error = error

    return res.render('base', about);
});

router.post('/signup', (req, res) => {
    const {
        email,
        password,
        password2,
        name
    } = req.body;

    if (!email || !password || !password2) {
        return '{"type": "error", "message": "Please fill out all fields."}'
    }

    if (password != password2) {
        return res.redirect(url.format({
            pathname: "/signup",
            query: {
                "error": "Passwords are not the same."
            }
        }))
    }

    if (password.length < 8) {
        return res.redirect(url.format({
            pathname: "/signup",
            query: {
                "error": "Your password needs to be at least 8 characters long."
            }
        }))
    }

    User.findOne({
        'personal.email': email
    }).then(user => {
        if (user) {
            return res.redirect(url.format({
                pathname: "/signup",
                query: {
                    "error": "That email is already in use."
                }
            }))
        } else {
            const newUser = new User({
                'personal.email': email,
                'personal.password': password,
                'meta.staff': false,
                'meta.creationDate': Date.now(),
            });

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

router.get('/login', function (req, res, next) {
    passport.authenticate('local', {
        failureRedirect: '/login'
    })

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

    return res.render('base', about);
});

router.post('/login', async function (req, res, next) {
    try {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
        })(req, res, next);
    } catch (err) {
        res.redirect(url.format({
            pathname: "/login",
            query: {
                "error": "There was an error logging you in, please try again."
            }
        }))
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;