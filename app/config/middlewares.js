const express = require('express');
const bodyParser = require('body-parser');
const session   = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
var redis   = require("redis");
var redisStore = require('connect-redis')(session);
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

module.exports = function(app){
    var client  = redis.createClient(6379, process.env.DATABASE2_HOST || "localhost");
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session( {
        secret : process.env.SESSION_SECRET || 'secret',
        store: new redisStore({ client: client}),
        resave : false,
        saveUninitialized : false,
        maxAge: null
    }));
    app.use(require('cookie-parser')());
    app.use(flash());
    app.use(allowCrossDomain);
    app.use(passport.initialize());
    app.use(passport.session());
};