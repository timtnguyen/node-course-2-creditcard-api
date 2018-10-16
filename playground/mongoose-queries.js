const { ObjectID } = require('mongodb'); 
const { mongoose } = require('../server/db/mongoose');
const { CreditCard } = require('../server/models/creditcard');

let id = 'bc53c883b86f7048bc3966a';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid'); 
// }
// CreditCard.find({
//     _id: id
// }).then((cards) => {
//     console.log('Creditcard: ', cards); 
// });

// CreditCard.findOne({
//     _id: id
// }).then((card) => {
//     console.log('Card: ', card); 
// });

CreditCard.findById(id)
    .then((card) => {
        if (!card) {
            return console.log('Id not valid'); 
        } 
        console.log('Find by id: ', card); 
    }).catch((err) => {
        console.log(err);
    });

