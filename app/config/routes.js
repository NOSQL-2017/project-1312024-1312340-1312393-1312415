var Router = require('express').Router;
var controllers = require('../app/controllers');
const multipart = require('connect-multiparty');
const Authentication = require('../config/authencation');
const multipartMiddleware = multipart();

module.exports = function (app) {

    var indexRouter = Router().get('/', controllers.index.index);
    app.use('/', indexRouter);
    var userRouter = Router()
        .post('/register', multipartMiddleware, controllers.user.register)
        .get('/login', controllers.user.loadLogin)
        .get('/register', controllers.user.loadRegister);
    app.use('/user', userRouter);
    var aboutRouter = Router().get('/', controllers.about.index);
    app.use('/about', Authentication, aboutRouter);

};