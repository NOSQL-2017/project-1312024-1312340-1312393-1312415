const express = require('express');
const bodyParser = require('body-parser');
const session   = require('express-session');
const flash = require('express-flash');



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
    app.use(flash());
};