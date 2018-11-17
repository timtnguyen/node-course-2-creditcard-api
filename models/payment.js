const mongoose = require('mongoose');
const { creditCardSchema } = require('./creditcard'); 
const Joi = require('joi');

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },

    card: {
        type: creditCardSchema,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const validatePayment = (payment) => {
    const schema = {
        amount: Joi.number().min(0).max(10000).required(),
        cardId: Joi.string().required()
    }

    return Joi.validate(payment, schema); 
}

const Payment = mongoose.model('Payment', paymentSchema); 

module.exports.paymentSchema = paymentSchema;
module.exports.Payment = Payment;
module.exports.validatePayment = validatePayment; 