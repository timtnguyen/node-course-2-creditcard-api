if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI:
        'mongodb://mongodb://thinhhuong:elkgrove09@ds143511.mlab.com:43511/debt-management' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/CreditCardApp' }
}