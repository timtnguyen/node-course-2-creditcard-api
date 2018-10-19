const { ObjectID } = require('mongodb'); 
const { mongoose } = require('../server/db/mongoose');
const { CreditCard } = require('../server/models/creditcard');

let id = 'bc53c883b86f7048bc3966a';


// CreditCard.remove()
//     .then((result) => {
//         console.log(result);
//     }, (err) => {
//         console.log(err); 
//     });

CreditCard.findOneAndRemove({ card: 'Citi Chase' })
    .then((result) => {
        console.log(result); 
    }, (err) => {
        console.log(err); 
    });

