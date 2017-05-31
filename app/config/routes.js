var Router = require('express').Router;
var controllers = require('../app/controllers');
var multipart = require('connect-multiparty');
var passport = require('../config/passport');
var Authentication = require('../config/authencation');
var multipartMiddleware = multipart();

module.exports = function (app) {

    var indexRouter = Router().get('/', controllers.index.index);
    app.use('/', indexRouter);
    var userRouter = Router()
        .get('/login', controllers.user.loadLogin)
        .post('/login', passport.authenticate('local', {
            failureRedirect: '/user/login'
        }), controllers.user.login)
        .post('/logout', controllers.user.logout)
        .post('/register', controllers.user.register)
        .get('/register', controllers.user.loadRegister);
    app.use('/user', userRouter);
    var aboutRouter = Router().get('/', controllers.about.index);
    app.use('/about', Authentication, aboutRouter);

};