const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, "require email"],
        minlength: [3, "email is shorter than 3"],
        unique: [true, "this email is already in use"],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not email'
        }
    },
    avatar: {
        type: String,
        required: [true, 'require avatar']
    }
    ,
    name:{
        type: String,
        required: [true, 'require name'],
        minlength: [3, "password is shorter than 3"]
    },
    password: {
        type: String,
        required: [true, 'require password'],
        minlength: [6, "password is shorter than 6"]
    }

});
UserSchema.plugin(uniqueValidator, {message: '{VALUE} is in use'});

var User = mongoose.model("users", UserSchema);

module.exports = User;