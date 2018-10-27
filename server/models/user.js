const mongoose = require('mongoose');
const Joi = require('joi'); 
const jwt = require('jsonwebtoken'); 
const _ = require('lodash'); 

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
        unique: true, 
        minlength: 5,
        maxlength: 250
    }, 
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']); 
};

// We use normal function because we have to use 'this' keyword 
userSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString(); 

    user.tokens = user.tokens.concat([ {access, token } ]);

    return user.save()
        .then(() => {
            return token; 
        });
};

// Define model method
userSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123'); 
    } 
    catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject(); 
        // });
        return Promise.reject();
    };

    return User.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
}

const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(1).max(250).required(), 
        email: Joi.string().email().min(5).max(250).required(),
        password: Joi.string().min(5).max(250).required()
    }

    return Joi.validate(user, schema); 
}

const User = mongoose.model('User', userSchema); 

module.exports.User = User; 
module.exports.validateUser = validateUser; 
