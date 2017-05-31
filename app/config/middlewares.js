const express = require('express');
const bodyParser = require('body-parser');
const session   = require('express-session');
const flash = require('express-flash');
const passport = require('passport');



module.exports = function(app){
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session( {
        secret : process.env.SESSION_SECRET || 'secret',
        resave : false,
        saveUninitialized : false,
        maxAge: null
    }));
    app.use(require('cookie-parser')());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
};