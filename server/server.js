const { mongoose } = require('./db/mongoose'); 
const { CreditCard } = require('./models/creditcard');
const { User } = require('./models/user'); 

const express = require('express');
const bodyParser = require('body-parser'); 

let app = express(); 

app.use(bodyParser.json()); 

app.get('/cards', (req, res) => {
    CreditCard.find()
        .then((cards) => {
            res.send(cards);
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

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});


module.exports = {app};