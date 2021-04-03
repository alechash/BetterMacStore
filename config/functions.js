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
const language = function (user) {
    var userLanguage;
    if (user) {
        userLanguage = user.personal.language
    } else {
        userLanguage = 'english'
    }

    return require(`../translations/${userLanguage}`)
}

module.exports = {
    loggedin,
    staff,
    needLoggedin,
    language
};