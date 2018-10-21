const { ObjectID } = require('mongodb'); 
const { mongoose } = require('./db/mongoose'); 
const { CreditCard } = require('./models/creditcard');
const { User } = require('./models/user'); 
const _ = require('lodash'); 

const express = require('express');
const bodyParser = require('body-parser'); 

let app = express(); 

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

//https://git.heroku.com/polar-reef-69029.git
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});


module.exports = {app};