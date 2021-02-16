const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('ReleaseNotes', ReleaseNotes)