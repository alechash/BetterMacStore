const mongoose = require('mongoose');

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

module.exports = mongoose.model('Image', Image)