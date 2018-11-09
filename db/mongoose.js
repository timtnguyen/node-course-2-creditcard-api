const mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/CreditCardApp', {
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to MongoDB'); 
}).catch((err) => {
    console.log('Not connected to MongoDB', err); 
});

module.exports = mongoose;  