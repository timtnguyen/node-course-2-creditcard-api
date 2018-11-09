const expect = require('expect');
const request = require('supertest'); 
const { ObjectID } = require('mongodb'); 

const { app } = require('../server'); 
const { CreditCard } = require('../models/creditcard'); 
const { User } = require('../models/user'); 
const { cards, populateCreditCards, users, populateUsers } = require('./seed/seed'); 

// let cards = [{
//     _id: new ObjectID(), 
//     card: 'Citi Chase', 
//     balance: 1200,
//     interest: 23
// }, {
//     _id: new ObjectID(), 
//     card: 'CapitalOne',
//     balance: 2100,
//     interest: 12
// }];
beforeEach(populateUsers); 
beforeEach(populateCreditCards);

describe('POST /cards', () => {
    it('should create a new card', (done) => {
        let card = {
            card: 'Chase',
            balance: 1000,
            interest: 12
        }

        request(app)
            .post('/cards')
            .send(card)
            .expect(200)
            .expect((res) => {
                expect(res.body.card).toBe('Chase');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                CreditCard.find({ card: 'Chase' })
                    .then((cards) => {
                        expect(cards.length).toBe(1);
                        expect(cards[0].card).toBe('Chase'); 
                        done(); 
                    }).catch((err) => {
                        done(err); 
                    });
            });
    });

    it('should not create card with invalid body data', (done) => {
        request(app)
            .post('/cards')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }

                CreditCard.find()
                    .then((cards) => {
                        expect(cards.length).toBe(2);
                        done(); 
                    }).catch((e) => {
                        done(e); 
                    });
            });
    });
});

// describe('GET /cards', () => {
//     it('should get all cards', (done) => {
//         request(app)
//             .get('/cards')
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.cards.length).toBe(2);
//             })
//             .end(done); 
//         }); 
// });

describe('GET /cards/:id', () => {
    // it('should return card doc', (done) => {
    //     request(app)
    //         .get(`/cards/${cards[0]._id.toHexString()}`)
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.cards.card).toBe('Citi Chase');
    //         })
    //         .end(done); 
    // });

    it('should return 404 if card not found', (done) => {
        request(app)
            .get('/cards/123')
            .expect(404)
            .end(done); 
    });

    it('should return 404', (done) => {
        let hexID = new ObjectID().toHexString();
        request(app)
            .get(`/cards/${hexID}`)
            .expect(404)
            .end(done); 
    });
});

describe('DELETE /cards/:id', () => {
    // it('Should remove a card', (done) => {
    //     let hexId = cards[1]._id.toHexString();

    //     request(app)
    //         .delete(`/cards/${hexId}`)
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.card._id).toBe(hexId);
    //             done();
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err); 
    //             }
    //         });
        
            
    // });

    it('Should return 404 if card not found', (done) => {
        request(app)
            .delete(`/cards/123`)
            .expect(404)
            .end(done); 
    });

    // it('Should return 404 if ObjectID is invalid', (done) => {
    //     let hexId = cards[1]._id.toHexString();

    
    //     if (!ObjectID.isValid(hexId)) {
    //         return res.status(404).send()
    //     }

    //     request(app)
    //         .delete(`/cards/${hexId}`)
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.card._id).toBe(hexId); 
    //             done(); 
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err); 
    //             }
    //         });
    // });
});

describe('PATCH /cards/:id', () => {
    it('should update card', (done) => {
        let hexId = cards[1]._id.toHexString();
        let newCard = 'Chase Freedom';  

        request(app) 
            .patch(`/cards/${hexId}`)
            .send({
                card: newCard
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.card).toBe(newCard); 
                done(); 
            })
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email); 
            })
            .end(done); 
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done); 
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let name = 'Test';
        let email = 'example@example.com';
        let password = '123qwe';

        request(app)
            .post('/users')
            .send({ name, email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy(); 
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email); 
            })
            .end((err) => {
                if (err) {
                    return done(err); 
                }

                User.findOne({ email })
                    .then((user) => {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password); 
                        done(); 
                    }).catch((err) => {
                        done(err); 
                    });
            });
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end(done); 
    });
});





