const loggedin = function (user) {
    if (user) {
        return true;
    } else {
        return false;
    };
};

const staff = function (user) {
    if (loggedin(user) == true && user.meta.staff == true) {
        return true;
    } else {
        return false;
    };
};

const needLoggedin = function (user) {
    if (user) {
        
    } else {
        next()
    }
}

module.exports = {
    loggedin,
    staff,
    needLoggedin
};