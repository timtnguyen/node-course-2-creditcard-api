const mongoose = require('mongoose'); 
const { creditCardSchema } = require('./creditcard'); 
const Joi = require('joi'); 

const ExpenseSchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 250
    },

    item: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 250
    }, 
    total: {
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

const validateExpense = (expense) => {
    const schema = {
        category: Joi.string().min(1).max(250).required(),
        item: Joi.string().min(1).max(250).required(),
        total: Joi.number().min(0).max(10000).required(),
        cardId: Joi.string().required()
    }
    return Joi.validate(expense, schema); 
}

const Expense = mongoose.model('Expense', ExpenseSchema); 

module.exports.Expense = Expense; 
module.exports.validateExpense = validateExpense;