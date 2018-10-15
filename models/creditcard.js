const mongoose = require('mongoose');

let CreditCard = mongoose.model('CreditCard', {
    card: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 250
    },
    balance: {
        type: Number,
        required: true,
        min: 0,
        max: 50000
    }
});

module.exports.CreditCard = CreditCard; 
