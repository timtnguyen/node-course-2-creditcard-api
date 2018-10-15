const { MongoClient, ObjectID } = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/CreditCardApp', (err, client) => {
    if (err) {
        return console.log('Unable to connected to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db('CreditCardApp');

    // db.collection('CreditCards').find({ balance: { $gte: 4000 } }).toArray()
    //     .then((docs) => {
    //         console.log('CreditCards');
    //         console.log(JSON.stringify(docs, undefined, 2)); 
    //     }, (err) => {
    //         console.log('Unable to fetch cards', err); 
    //     });

    // db.collection('CreditCards').find().count()
    //     .then((count) => {
    //         console.log(`CreditCard count: ${count}`);
    //     }, (err) => {
    //         console.log(err); 
    //     });

    db.collection('Users').find({ _id: new ObjectID('5bc41dee4e1b8a0414aa9935')}).toArray()
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log(err);
        });
    //client.close(); 
});