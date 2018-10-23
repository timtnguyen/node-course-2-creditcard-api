// const env = process.env.NODE_ENV || 'development'; 

// console.log('env ***', env); 

// if (env === 'development') {
//     process.env.PORT = 3000; 
//     process.env.MONGO_URI = 'mongodb://localhost/CreditCardApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000; 
//     process.env.MONGO_URI = 'mongodb://localhost/CreditCardAppTest';
// }

const { ObjectID } = require('mongodb'); 
const mongoose  = require('./db/mongoose'); 
const { CreditCard } = require('./models/creditcard');
const { User } = require('./models/user'); 
const { Expense, validateExpense } = require('./models/expense'); 
const _ = require('lodash'); 
const Fawn = require('fawn'); 

const express = require('express');
const bodyParser = require('body-parser'); 


let app = express(); 

Fawn.init(mongoose); 

app.use(bodyParser.json()); 

app.get('/cards', (req, res) => {
    CreditCard.find()
        .then((cards) => {
            res.send({cards});
        }, (err) => {
            res.status(400).send(err);
        });
});

app.post('/cards', (req, res) => {
    let card = new CreditCard({
        card: req.body.card,
        balance: req.body.balance
    });

    card.save()
        .then((card) => {
            res.send(card); 
        }, (err) => {
            res.status(400).send(err); 
        });
}); 

// bc53c883b86f7048bc3966a
app.get('/cards/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id not valid'); 
    }

    CreditCard.findById(id)
        .then((card) => {
            if (!card) {
                return res.status(404).send(); 
            }
            res.send({card}); 
        }).catch((err) => {
            res.status(400).send(err);
        });
});

app.delete('/cards/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid'); 
    }
    CreditCard.findByIdAndRemove(id) 
        .then((card) => {
            if (!card) {
                return res.status(404).send(); 
            }
            res.send({card}); 
        }).catch((err) => {
            res.status(400).send('Something wrong', err);
        });
});

app.patch('/cards/:id', (req, res) => {
    let id = req.params.id; 
    let body = _.pick(req.body, ['card', 'balance']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); 
    }
 
    CreditCard.findByIdAndUpdate(id, {
        $set: {
            card: req.body.card,
            balance: req.body.balance
        }
    }, {
        new: true
    }).then((card) => {
        if (!card) {
            return res.status(404).send();
        }
        res.send(card); 
    }).catch((err) => {
        res.status(400).send(err); 
    });     
});

// EXPENSE ROUTES 

app.get('/expenses', (req, res) => {
    Expense.find()
        .then((expenses) => {
            res.send({expenses})
        }, (err) => {
            res.status(400).send(err); 
        });
});

app.post('/expenses', async (req, res) => {
    const result = validateExpense(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    let card = await CreditCard.findById(req.body.cardId);
    if (!card) {
        res.status(400).send('Invalid card'); 
    }
    
    let newExpense = new Expense({
        item: req.body.item,
        total: req.body.total,
        card: {
            _id: card._id,
            card: card.card,
            balance: card.balance + req.body.total
        }
    });

    try {
        new Fawn.Task()
            .save('expenses', newExpense)
            .update('creditcards', { _id: card._id }, {
                $inc: { balance: +newExpense.total }
            })
            .run(); 
            res.send(newExpense); 
    } catch(ex) {
        res.status(500).send('Something failed'); 
    }
});

//https://git.heroku.com/polar-reef-69029.git
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});


module.exports = {app};