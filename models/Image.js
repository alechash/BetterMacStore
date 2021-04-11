const mongoose = require('mongoose');

// modal for images (like app icons and screenshots)
const Image = new mongoose.Schema({
    url: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    type: {
        type: String,
        unique: false,
        required: true,
        default: false
    },
    app: {
        type: String,
        unique: false,
        required: true
    },
    creationDate: {
        type: Date,
        unique: false,
        required: true,
        default: Date.now()
    },
});

module.exports = mongoose.model('Image', Image)