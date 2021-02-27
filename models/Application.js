const mongoose = require('mongoose');

const Application = new mongoose.Schema({
    meta: {
        developer: {
            type: String,
            unique: false,
            required: true,
        },
        name: {
            type: String,
            unique: false,
            required: true,
        },
        description: {
            type: String,
            unique: false,
            required: true,
        },
        creationDate: {
            type: Date,
            unique: false,
            required: true,
        },
        latestRelease: {
            type: String,
            unique: false,
            required: true,
            default: false
        },
    },
    binaries: {
        app: {
            type: String,
            unique: false,
            required: true,
        },
        zip: {
            type: String,
            unique: false,
            required: true,
        },
        dmg: {
            type: String,
            unique: false,
            required: false,
        },
    },
    unique: {
        appId: {
            type: String,
            unique: true,
            required: true,
        },
    },
});

module.exports = mongoose.model('Application', Application)