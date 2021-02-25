const mongoose = require('mongoose');

const Company = new mongoose.Schema({
    meta: {
        name: {
            type: String,
            unique: false,
            required: false
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

module.exports = mongoose.model('Company', Company)