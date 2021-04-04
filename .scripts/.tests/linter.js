const ejsLint = require('ejs-lint');
const fs = require('fs');
const path = require('path');

var dir = path.join(__dirname, '..', '..', '/views/');
var ejsFiles = []

const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

const getContents = function (file) {
    fs.readFile(file, function read(err, data) {

        console.log(file)

        if (err) {
            throw err;
        }
        const content = data;

        return content;
    });
}

ejsFiles = getAllFiles(dir, ejsFiles)

for (i = 0; i < ejsFiles.length; i++) {
    try {
        console.log(`Reading EJS file ${ejsFiles[i]}`)

        var contents = fs.readFileSync(ejsFiles[i], 'utf8');
        ejsLint(contents)

        console.log(`EJS file, ${ejsFiles[i]}, passed test`)
    } catch (err) {
        throw new Error(err)
    }
}