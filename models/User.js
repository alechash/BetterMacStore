const mongoose = require('mongoose');

// modal for users
const User = new mongoose.Schema({
    personal: {
        email: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            unique: false,
            required: false
        },
        password: {
            type: String,
            unique: false,
            required: true
        },
        language: {
            type: String,
            unique: false,
            required: true,
            default: 'English'
        },
    },
    developer: {
        developerEnabled: {
            type: Boolean,
            unique: false,
            required: true,
            default: false
        },
        organizations: {
            type: Array,
            unique: false,
            required: true,
            default: []
        },
    },
    meta: {
        creationDate: {
            type: Date,
            unique: false,
            required: true,
            default: Date.now()
        },
        staff: {
            type: Boolean,
            unique: false,
            required: true,
            default: false
        },
    }
});

module.exports = mongoose.model('User', User)