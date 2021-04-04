/**
 * NOTE: this file shouldn't be changed, this file is used
 * to add needed translations to translation files
 * 
 * This will ask the user for a English sentence, then wi-
 * -th that sentence, it will go through all translation -
 * -files and add an object to the file
 * 
 * 
 * NOTE: translation files are housed in the /translations
 * folder

const readline = require('readline')
const path = require('path');
const fs = require('fs');
const re = new RegExp(' ', 'g');
const jsonMerger = require("json-merger");

var englishString

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Only use this if a new string of text has been added to the front end.')
console.log('Make sure to input English only.')
console.log('Make sure you edit the EJS file too, add the <%= %> variable.')
console.log('This cannot be reversed, be careful.')
console.log('If you wish not to continue, press CTRL+C\n')

rl.question("Please input the new string in English: ", function (answer) {
    // TODO: Log the answer in a database
    sendAnswer(answer)

    rl.close();
});

function sendAnswer(answer) {
    englishString = answer

    translate()
}

function translate() {
    console.log('You input in English: ', englishString, '\n\nFiles to edit:')

    var directoryPath = path.join(__dirname, '../', 'translations/');

    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        const newTitle = englishString.replace(re, '_')

        //listing all files using forEach
        files.forEach(function (file) {
            var oldFile = fs.readFileSync(directoryPath + file)

            const newStringToAdd = eval(`{
                ${newTitle}:englishString
            }`)

            Object.assign(oldFile, oldFile, JSON.stringify(newStringToAdd))

            console.log(oldFile)
            console.log('editing file: ', file)
            fs.writeFileSync(directoryPath + file, JSON.stringify(oldFile))
        });
    });
}
*/