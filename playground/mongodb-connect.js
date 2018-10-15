//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, objectID } = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/CreditCardApp', (err, client) => {
    if (err) {
        return console.log('Unable to connected to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db('CreditCardApp');

    // db.collection('CreditCards').insertOne({
    //     card: 'American Express',
    //     balance: 3400
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert card', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2)); 
    // });

    // db.collection('Users').insertOne({
    //     name: 'Thinh Nguyen',
    //     age: 52,
    //     location: 'Sacramento'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user'); 
    //     }

    //     console.log(result.ops[0]._id.getTimestamp()); 
    // });

    //client.close(); 
});