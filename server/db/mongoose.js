const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/CreditCardApp', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
    }, (err) => {
        console.log('Unable to connected to mongoDB', err);
    }); 

module.exports = mongoose; 