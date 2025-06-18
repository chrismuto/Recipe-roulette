const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    savedRecipes: [{
        type: String,
        default: [],
        required: true
    }],
    refreshToken: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('User', userSchema);