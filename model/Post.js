const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    title: {
        type: String,
        required: true,
        max:255,
        min: 3
    },
    image: {
        type: String,
        required: false
    },
    uploadDate: {
        type: Date,
        default: () => Date.now()
    },
    date: {
        type: String
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Post', postSchema);


