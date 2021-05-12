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
        orgId: {
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
        tags: {
            type: [String],
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

Application.index({
    'meta.name': 'text',
    'meta.description': 'text',
    'meta.tags': 'text',
    'meta.category': 'text',
    'meta.developer': 'text',
}, {
    weights: {
        'meta.name': 10,
        'meta.description': 3,
        'meta.tags': 2,
        'meta.category': 1,
        'meta.developer': 1,
    },
});

Application.on('index', error => {
    console.log(error.message);
});

module.exports = mongoose.model('Application', Application, 'application')