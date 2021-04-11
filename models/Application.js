const mongoose = require('mongoose');

// modal for applications
const Application = new mongoose.Schema({
    meta: {
        developer: {
            type: String,
            unique: false,
            required: true,
        },
        org: {
            type: Boolean,
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
        tags: {
            type: Array,
            unique: false,
            required: false,
            default: []
        },
        category: {
            type: String,
            unique: false,
            required: false,
        }
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