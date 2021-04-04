// function to return boolean if a user is loggedin
const loggedin = function (user) {
    if (user) {
        return true;
    } else {
        return false;
    };
};


// function to return a boolean if a user is staff
const staff = function (user) {
    if (loggedin(user) == true && user.meta.staff == true) {
        return true;
    } else {
        return false;
    };
};


// redirect people to /login if they arent logged in
const needLoggedin = function (user, res, next) {
    if (!user) {
        return res.redirect('/login')
    } else {
        return next()
    }
}

// function to return the language of the logged in user (defaults to english)
const language = function (user, languageCookie) {
    var userLanguage;
    if (user) {
        userLanguage = user.personal.language
    } else {
        try {
            userLanguage = languageCookie
        } catch (err) {
            userLanguage = 'English'
        }
    }

    // fallback for if the langauge string in the model breaks and the user cant access the site
    if (userLanguage == null) {
        userLanguage = 'English'
    }

    const English = require(`../translations/English`)
    const YourLang = require(`../translations/${userLanguage}`)
    const langObject = merge(English, YourLang);

    return langObject
}

// convert two character language code to language name
const changeLanguage = function (code) {
    try {
        const langaugeCodes = require('./langCodes')

        return langaugeCodes[code]
    } catch (err) {
        return 'English'
    }
}

// custom object merge function
const merge = function (...arguments) {
    // create a new object
    let target = {};

    // merge the object into the target object
    const merger = (obj) => {
        for (let prop in obj) {
            if (obj[prop] == '') {} else {
                target[prop] = obj[prop];
            }
        }
    };

    // iterate through all objects and merge them with target
    for (let i = 0; i < arguments.length; i++) {
        merger(arguments[i]);
    }

    return target;
};

module.exports = {
    loggedin,
    staff,
    needLoggedin,
    language,
    changeLanguage
};