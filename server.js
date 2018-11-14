
const { ObjectID } = require('mongodb'); 
const mongoose  = require('./db/mongoose'); 
const { CreditCard } = require('./models/creditcard');
const { Expense, validateExpense } = require('./models/expense'); 
const { Payment, validatePayment } = require('./models/payment'); 
//const { User, validateUser } = require('./models/user'); 
//const { authenticate } = require('./middleware/authenticate'); 
const _ = require('lodash'); 
const Fawn = require('fawn'); 
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser'); 


let app = express(); 

Fawn.init(mongoose); 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about'); 
});

app.get('/cards', (req, res) => {
    CreditCard.find()
        .then((cards) => {
            res.render('cards', {
                cards: cards
            });
        }, (err) => {
            res.status(400).send(err);
        });
});

app.post('/cards', (req, res) => {
    let card = new CreditCard({
        card: req.body.card,
        balance: req.body.balance,
        interest: req.body.interest
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

    CreditCard.findOne({ _id: id })
        .then((card) => {
            if (!card) {
                return res.status(404).send(); 
            }
            res.send(card); 
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
            res.send(card); 
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
            balance: req.body.balance,
            interest: req.body.interest
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
            res.send(expenses)
        }, (err) => {
            res.status(400).send(err); 
        });
});

app.post('/expenses', (req, res) => {
    const result = validateExpense(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    CreditCard.findById(req.body.cardId)
        .then((card) => {
            if (!card) {
                return res.status(400).send('Invalid card'); 
            }
            let newExpense = new Expense({
                item: req.body.item,
                total: req.body.total,
                card: {
                    _id: card._id,
                    card: card.card
                }
            }); 
            new Fawn.Task()
                .save('expenses', newExpense)
                .update('creditcards', { _id: card._id }, {
                    $inc: { balance: +newExpense.total }
                })
                .run(); 
                res.send(newExpense); 
        })
        .catch((err) => {
            res.status(500).send('Something failed'); 
        });
});

app.delete('/expenses/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); 
    }

    Expense.findByIdAndRemove(id)
        .then((expense) => {
            if (!expense) {
                return res.status(404).send(); 
            }

            new Fawn.Task()
                .update('creditcards', { _id: expense.card._id }, {
                    $inc: { balance: -expense.total }
                })
                .run(); 

            res.send(expense); 
        }).catch((err) => {
            res.status(400).send('Something goes wrong', err); 
        });
});

app.patch('/expenses/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['item', 'total']); 

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid Id'); 
    }

    Expense.findById(id)
        .then((expense) => {
            new Fawn.Task()
                .update('creditcards', { _id: expense.card._id }, {
                    $inc: { balance: -expense.total }
                })
                .run(); 
        })

    Expense.findByIdAndUpdate(id, {
        $set: {
            item: req.body.item,
            total: req.body.total
        }
    }, {
        new: true
    }).then((expense) => {
        if (!expense) {
            return res.status(404).send(); 
        }

        new Fawn.Task()
            .update('creditcards', { _id: expense.card._id }, {
                $inc: { balance: +expense.total }
            })
            .run(); 

        res.send(expense); 
    }).catch((err) => {
        res.status(400).send(err); 
    });
});

// PAYMENT ROUTES

app.get('/payments', (req, res) => {
    Payment.find()
        .then((payment) => {
            res.send(payment); 
        }, (err) => {
            res.status(400).send(err); 
        });
});

app.post('/payments', (req, res) => {
    const result = validatePayment(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message); 
    }

    CreditCard.findById(req.body.cardId)
        .then((card) => {
            if (!card) {
                return res.status(400).send('Invalid card'); 
            }

            let newPayment = new Payment({
                amount: req.body.amount,
                card: {
                    _id: card._id,
                    card: card.card
                }
            });
            new Fawn.Task()
                .save('payments', newPayment)
                .update('creditcards', { _id: card._id}, {
                    $inc: { balance: -newPayment.amount }
                })
                .run();
                res.send(newPayment); 
        })
        .catch((err) => {
            res.status(500).send('Something failed'); 
        });
}); 

app.delete('/payments/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); 
    }

    Payment.findByIdAndRemove(id)
        .then((payment) => {
            if (!payment) {
                return res.status(404).send('Invalid payment'); 
            }

            new Fawn.Task()
                .update('creditcards', { _id: payment.card._id }, {
                    $inc: { balance: +payment.amount }
                })
                .run(); 

            res.send(payment);
        })
        .catch((err) => {
            res.status(404).send('Something wrong', err); 
        });
}); 

app.patch('/payments/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['amount']); 

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid ID'); 
    }

    Payment.findById(id) 
        .then((payment) => {
            new Fawn.Task()
                .update('creditcards', { _id: payment.card._id }, {
                    $inc: { balance: +payment.amount }
                })
                .run(); 
        });

    Payment.findByIdAndUpdate(id, {
        $set: {
            amount: req.body.amount
        }
    }, {
        new: true
    }).then((payment) => {
        if (!payment) {
            return res.status(404).send()
        }

        new Fawn.Task()
            .update('creditcards', { _id: payment.card._id }, {
                $inc: { balance: -payment.amount }
            })
            .run(); 

        res.send(payment); 
    }).catch((err) => {
        res.status(400).send(err); 
    });       
});

// USERS ROUTES
// app.get('/users', (req, res) => {
//     User.find().sort({ name: 1 })
//         .then((users) => {
//             res.send(users); 
//         }, (err) => {
//             res.status(400).send(err); 
//         }); 
// });

// app.post('/users', (req, res) => {
//     let result = validateUser(req.body);
//     if (result.error) {
//         return res.status(404).send(result.error.details[0].message); 
//     }
    
//     let body = _.pick(req.body, ['name', 'email', 'password']); 
//     let newUser = new User(body);

//     newUser.save()
//         .then(() => {
//             return newUser.generateAuthToken();
//         }).then((token) => {
//             res.header('x-auth', token).send(newUser);
//         }).catch((err) => {
//             res.status(400).send(err); 
//         });
// });


// app.get('/users/me', authenticate, (req, res) => {
//     res.send(req.user); 
// });

// // POST /users/login {email, password}
// app.post('/users/login', (req, res) => {
//     let body = _.pick(req.body, ['email', 'password']); 
    
//     User.findByCredentials(body.email, body.password)
//         .then((user) => {
//             return user.generateAuthToken()
//                 .then((token) => {
//                     res.header('x-auth', token).send(user); 
//                 });
//         }).catch((err) => {
//             res.status(400).send(); 
//         });
// }); 

// app.delete('/users/me/token', authenticate, (req, res) => {
//     req.user.removeToken(req.token)
//         .then(() => {
//             res.status(200).send();
//         }, (err) => {
//             res.status(400).send(err); 
//         });
// });


//https://git.heroku.com/polar-reef-69029.git
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});


//module.exports = {app};