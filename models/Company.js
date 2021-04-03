const mongoose = require('mongoose');

// modal for developer organizations
const Company = new mongoose.Schema({
    general: {
        name: {
            type: String,
            unique: true,
            required: true
        },
        legalName: {
            type: String,
            unique: false,
            required: false
        },
        email: {
            type: String,
            unique: false,
            required: true
        },
        phone: {
            type: Number,
            unique: false,
            required: false
        },
    },
    meta: {
        creationDate: {
            type: Date,
            unique: false,
            required: true,
            default: Date.now()
        },
        verified: {
            type: Boolean,
            unique: false,
            required: true,
            default: false
        },
        members: {
            type: Array,
            unique: false,
            required: true,
            default: []
        },
    },
    other: {
        website: {
            type: String,
            unique: false,
            required: false
        },
        twitter: {
            type: String,
            unique: false,
            required: false
        },
        location: {
            type: String,
            unique: false,
            required: false
        },
    },
    stores: {
        apple: {
            type: String,
            unique: false,
            required: false
        },
        android: {
            type: String,
            unique: false,
            required: false
        },
        microsoft: {
            type: String,
            unique: false,
            required: false
        },
    }
});

module.exports = mongoose.model('Company', Company)