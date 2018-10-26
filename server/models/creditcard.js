const mongoose = require('mongoose');

let creditCardSchema = new mongoose.Schema({
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
    }, 
    interest: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});

const CreditCard = mongoose.model('CreditCard', creditCardSchema); 

module.exports.creditCardSchema = creditCardSchema;
module.exports.CreditCard = CreditCard; 
