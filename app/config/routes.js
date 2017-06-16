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
        .get('/login/facebook/callback', passport.authenticate('facebook', {
            failureRedirect: '/user/login',
            scope: ['email']
        }), controllers.user.loginFacebook)
        .get('/login/facebook', passport.authenticate('facebook'))
        .get('/register', controllers.user.loadRegister);
    app.use('/user', userRouter);
    var aboutRouter = Router().get('/', controllers.about.index);
    app.use('/about',  aboutRouter);
    var friendRouter = Router().get('/', controllers.friend.index);
    app.use('/friend', Authentication, friendRouter);
    var imageRouter = Router().get('/', controllers.image.index).get('/:id', controllers.image.show);
    app.use('/image',Authentication, imageRouter);
    var adminRouter = Router().get('/', controllers.admin.index);
    app.use('/admin',Authentication, adminRouter);

};