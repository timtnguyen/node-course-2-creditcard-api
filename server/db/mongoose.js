const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/CreditCardApp', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
    }, (err) => {
        console.log('Unable to connected to mongoDB', err);
    }); 

module.exports = mongoose; 