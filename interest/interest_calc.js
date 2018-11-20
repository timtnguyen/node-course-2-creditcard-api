const { CreditCard } = require('../models/creditcard'); 
const { Expense, validateExpense } = require('../models/expense');
const { Payment, validatePayment } = require('../models/payment'); 
const schedule = require('node-schedule'); 

module.exports.calculateTax = () => {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1,2,3,4,5,6,0];
    rule.hour = 22;
    rule.minute = 1;

    schedule.scheduleJob(rule, function() {
        console.log(rule);

        CreditCard.update(
            { card: 'Discover'},
            { $mul: { balance: 1.0006298 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'American Express' },
            { $mul: { balance: 1.0004106 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'Golden1' },
            { $mul: { balance: 1.000301 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'BOA Cash Rewards' },
            { $mul: { balance: 1.0005202 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'BOA Balance Rewards' },
            { $mul: { balance: 1.0006572 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'Citi Preferred' },
            { $mul: { balance: 1.0006846 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'Citi Simplicity' },
            { $mul: { balance: 1.0006572 } }
        ).then((result) => {
            console.log(result); 
        });
    
        CreditCard.update(
            { card: 'Citi Costco' },
            { $mul: { balance: 1.0004723 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'Chase Freedom' },
            { $mul: { balance: 1.0006846 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'Chase Southwest' }, 
            { $mul: { balance: 1.0004723 } }
        ).then((result) => {
            console.log(result); 
        });
    });   
};