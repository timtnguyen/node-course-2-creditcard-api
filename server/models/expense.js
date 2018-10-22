const mongoose = require('mongoose'); 
const { CreditCardSchema } = require('./creditcard'); 
const Joi = require('joi'); 

const ExpenseSchema = new mongoose.Schema({
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
        type: CreditCardSchema,
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now
    }
});
const Expense = mongoose.model('Expense', ExpenseSchema); 

const validateExpense = (expense) => {
    const schema = {
        cardId: Joi.string().required(),
        item: Joi.string().min(1).max(250).required(),
        total: Joi.number().min(0).max(10000).required()
    }
    return Joi.validate(expense, schema); 
}


module.exports.Expense = Expense; 
module.exports.validateExpense = validateExpense;