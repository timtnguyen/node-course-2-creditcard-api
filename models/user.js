const mongoose = require('mongoose');
const Joi = require('joi'); 
const jwt = require('jsonwebtoken'); 
const _ = require('lodash'); 
const bcrypt = require('bcryptjs'); 

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 250
    }, 
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        maxlength: 250,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 250
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// userSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();

//     return _.pick(userObject, ['_id', 'email']); 
// };

// // We use normal function because we have to use 'this' keyword 
// userSchema.methods.generateAuthToken = function() {
//     let user = this;
//     let access = 'auth';
//     let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString(); 

//     user.tokens = user.tokens.concat([ {access, token } ]);

//     return user.save()
//         .then(() => {
//             return token; 
//         });
// };

// userSchema.methods.removeToken = function(token) {
//     let user = this;

//     return user.update({
//         $pull: {
//             tokens: {
//                 token: token
//             }
//         }
//     });
// };

// // Define model method
// userSchema.statics.findByToken = function(token) {
//     let User = this;
//     let decoded;

//     try {
//         decoded = jwt.verify(token, 'abc123'); 
//     } 
//     catch(e) {
//         // return new Promise((resolve, reject) => {
//         //     reject(); 
//         // });
//         return Promise.reject();
//     };

//     return User.findOne({
//         '_id': decoded._id,
//         'tokens.access': 'auth',
//         'tokens.token': token
//     });
// };

// userSchema.statics.findByCredentials = function(email, password) {
//     let User = this;

//     return User.findOne({ email })
//         .then((user) => {
//             if (!user) {
//                 return Promise.reject(); 
//             }

//             return new Promise((resolve, reject) => {
//                 bcrypt.compare(password, user.password, (err, res) => {
//                     if (res) {
//                         resolve(user); 
//                     } else {
//                         reject(); 
//                     }
//                 });
//             });
//         });
// };

const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(1).max(250).required(), 
        email: Joi.string().email().min(5).max(250).required(),
        password: Joi.string().min(5).max(250).required()
    }

    return Joi.validate(user, schema); 
};

// userSchema.pre('save', function(next) {
//     let user = this;

//     if (user.isModified('password')) {

//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(user.password, salt, (err, hash) => {
//                 user.password = hash;
//                 next(); 
//             });
//         });
//     } else {
//         next(); 
//     }
// });

const User = mongoose.model('User', userSchema); 

module.exports.User = User; 
module.exports.validateUser = validateUser; 
