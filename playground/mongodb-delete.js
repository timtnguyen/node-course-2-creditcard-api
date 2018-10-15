const { MongoClient, ObjectID } = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/CreditCardApp', (err, client) => {
    if (err) {
        return console.log('Unable to connected to MongoDB server');
    }

    console.log('Connected to MongoDB server');
    const db = client.db('CreditCardApp');

    // db.collection('CreditCards').deleteMany({ card: 'Citi' })
    //     .then((result) => {
    //         console.log(result);
    //     }, (err) => {
    //         console.log(err);
    //     });

    db.collection('CreditCards').deleteOne({
        _id: new ObjectID('5bc50a33c39b2822b5d8688f')
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    });
    //client.close(); 
});