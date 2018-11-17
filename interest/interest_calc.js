const { CreditCard } = require('../models/creditcard'); 
const { Expense, validateExpense } = require('../models/expense');
const { Payment, validatePayment } = require('../models/payment'); 

module.exports.calculateTax = () => {
    setInterval(() => {
        const second = new Date().getSeconds();
        
        CreditCard.update(
            { card: 'Discover'},
            { $mul: { balance: 1.000678 } }
        ).then((result) => {
            console.log(result); 
        });

        CreditCard.update(
            { card: 'Citi Costco' },
            { $mul: { balance: 1.000465 } }
        ).then((result) => {
            console.log(result); 
        });
    }, 1000000); 
}