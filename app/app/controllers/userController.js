var cloudinary = require('cloudinary');
var axios = require('axios');
var fs = require('fs');
cloudinary.config({
    cloud_name: 'du27rtoxp',
    api_key: '961163633288279',
    api_secret: 'E40LT_jwdgycmLksE37Gql21E5M'
});

var userController = {
    loadLogin: function (req, res) {
        res.render('user/login', {
            page: "login"
        })
    },
    loadRegister: function (req, res) {
        res.render('user/register', {
            page: "register",
            url: process.env.FRONT_END_LOGIN_API_URL
        })
    },
    register:function (req, res) {
        req.login(req.body.user, function (err) {
            if (err) {
                console.log(err);
            }
            return res.redirect('/');
        });
    },
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },
    login: function (req, res) {

        res.redirect('/');
    },
    loginFacebook: function (req, res) {
        res.redirect('/');
    }
};

module.exports = userController;