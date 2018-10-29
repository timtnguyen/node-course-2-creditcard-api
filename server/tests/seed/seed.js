const { ObjectID } = require('mongodb');
const { CreditCard } = require('./../../models/creditcard'); 
const { User } = require('./../../models/user'); 
const jwt = require('jsonwebtoken'); 

let userOneId = new ObjectID(); 
let userTwoId = new ObjectID();

let users = [{
    _id: userOneId,
    name: 'Huong',
    email: 'q@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth '}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    name: 'Thinh',
    email: 'tim@example.com',
    password: 'userTwoPassword'
}];

let cards = [{
    _id: new ObjectID(), 
    card: 'Citi Chase', 
    balance: 1200,
    interest: 23
}, {
    _id: new ObjectID(), 
    card: 'CapitalOne',
    balance: 2100,
    interest: 12
}];

const populateCreditCards = (done) => {
    CreditCard.remove({})
        .then(() => {
            CreditCard.insertMany(cards); 
        }).then(() => {
            done(); 
        });
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save(); 
            let userTwo = new User(users[1]).save();
    
            return Promise.all([userOne, userTwo])
                .then(() => {
                    done(); 
                });
        });
};

module.exports = { cards, populateCreditCards, users, populateUsers }; 