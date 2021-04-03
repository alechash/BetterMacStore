const mongoose = require('mongoose');

// modal for ratings for different applications
const Rating = new mongoose.Schema({
    from: {
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
    rating: { // one to five stars
        type: Number,
        unique: false,
        required: true,
        default: false
    },
    description: {
        type: String,
        unique: false,
        required: false,
        default: false
    },
    title: {
        type: String,
        unique: false,
        required: false,
        default: false
    },
    response: {
        type: String,
        unique: false,
        required: false,
        default: false
    },
    creationDate: {
        type: Date,
        unique: false,
        required: true,
        default: Date.now()
    },
});

module.exports = mongoose.model('Rating', Rating)