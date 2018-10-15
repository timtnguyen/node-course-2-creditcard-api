const { MongoClient, ObjectID } = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/CreditCardApp', (err, client) => {
    if (err) {
        return console.log('Unable to connected to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db('CreditCardApp');

    // db.collection('CreditCards').findOneAndUpdate({ card: 'Discover' }, {
    //     $set: {
    //         balance: 2500
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(err);
    // });

    db.collection('CreditCards').findOneAndUpdate({ card: 'Discover'}, {
        $inc: {
            balance: 500
        }
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    });
    //client.close(); 
});