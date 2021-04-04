const langs = require('../config/langCodes')
const english = require('../translations/English')
const path = require('path')
const fs = require('fs')
const dirPath = path.join(__dirname, '..', 'i18n_compiled');

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

const makeFile = function (filePath, contents, name) {
    fs.writeFile(filePath, contents, (err) => {
        if (err) throw err;

        console.log(`LANG COMPILING: ${name} was created with compile language`);
    });
}

const start = function () {
    for (let prop in langs) {
        const otherLang = require(`../translations/${langs[prop]}`)

        const merged = merge(english, otherLang)

        makeFile(path.join(dirPath, langs[prop]) + '.js', 'const language = ' + JSON.stringify(merged) + '\n\nmodule.exports = language', langs[prop])
    }
}

const cleanUp = function (dir) {
    fs.rm(dir, {
        recursive: true,
        force: true
    }, (err) => {
        if (err) {
            throw err;
        }

        console.log(`LANG COMPILING: ${dir} is deleted`);

        fs.mkdir(dir, {
            recursive: true
        }, (err) => {
            if (err) {
                throw err;
            }

            console.log(`LANG COMPILING: ${dir} is made`);

            start()
        })
    });

    return true
}

cleanUp(dirPath)