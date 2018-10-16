const expect = require('expect');
const request = require('supertest'); 

const { app } = require('../server'); 
const { CreditCard } = require('../models/creditcard'); 

let cards = [{
    card: 'Citi Chase', 
    balance: 1200
}, {
    card: 'CapitalOne',
    balance: 2100
}];

beforeEach((done) => {
    CreditCard.remove({})
        .then(() => {
            CreditCard.insertMany(cards); 
        }).then(() => {
            done(); 
        });
});

describe('POST /cards', () => {
    it('should create a new card', (done) => {
        let card = {
            card: 'Chase',
            balance: 1000
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

describe('GET /cards', () => {
    it('should get all cards', (done) => {
        request(app)
            .get('/cards')
            .expect(200)
            .expect((res) => {
                expect(res.body.cards.length).toBe(2);
            })
            .end(done); 
        }); 
});