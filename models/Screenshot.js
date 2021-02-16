const mongoose = require('mongoose');

const Screenshot = new mongoose.Schema({
    url: {
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

module.exports = mongoose.model('Screenshot', Screenshot)