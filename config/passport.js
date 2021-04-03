const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        // create new passport session from local strategy
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, (email, password, done) => {
            User.findOne({
                'personal.email': email
            }).then(user => {
                if (!user) {
                    return done(null, false, {
                        message: 'That email is not registered'
                    });
                }

                // compare encrypted loggedin user with users encrypted password that matches username
                bcrypt.compare(password, user.personal.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Password incorrect'
                        });
                    }
                });
            });
        })
    );

    // serialize the user
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};