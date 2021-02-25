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
    unique: {
        appId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    developer: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    developer: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    developer: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
});

module.exports = mongoose.model('Application', Application)