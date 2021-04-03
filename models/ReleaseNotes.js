const mongoose = require('mongoose');

// modal for release notes for applications releases
const ReleaseNotes = new mongoose.Schema({
    app: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    version: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    description: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    title: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    creationDate: {
        type: Date,
        unique: false,
        required: true,
        default: Date.now()
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
});

module.exports = mongoose.model('ReleaseNotes', ReleaseNotes)