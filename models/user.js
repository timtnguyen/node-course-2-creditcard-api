const mongoose = require('mongoose');

let User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 250
    }, 
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        maxlength: 250
    },
    password: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 250
    }
});

module.exports.User = User; 
