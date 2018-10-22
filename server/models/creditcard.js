const mongoose = require('mongoose');

let CreditCardSchema = new mongoose.Schema({
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

const CreditCard = mongoose.model('CreditCard', CreditCardSchema); 

module.exports.CreditCardSchema = CreditCardSchema;
module.exports.CreditCard = CreditCard; 
