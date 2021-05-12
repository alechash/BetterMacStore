const langs = require('../config/langCodes')
const english = require('../translations/English')
const path = require('path')
const fs = require('fs')
const dirPath = path.join(__dirname, '..', 'i18n_compiled');

console.log('[LANGUAGE TRANSLATIONS]\n')

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

        console.log(`[COMPILED] ${name} was compiles\n`);
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
    fs.rmdir(dir, {
        recursive: true,
        force: true
    }, (err) => {
        if (err) {
            throw err;
        }

        console.log(`[DELETED] ${dir} was deleted\n`);

        fs.mkdir(dir, {
            recursive: true
        }, (err) => {
            if (err) {
                throw err;
            }

            console.log(`[CREATED] ${dir} was made\n`);

            start()
        })
    });

    return true
}

cleanUp(dirPath)