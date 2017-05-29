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
            url: process.env.LOGIN_API_URL
        })
    },
    logout: function (req, res) {
        req.logout();
        res.redirect('/message');
    },
    register: function (req, res) {
        cloudinary.uploader.upload(req.files.avatar.path, function (result) {
            fs.unlinkSync(req.files.avatar.path);
            if (!result) {
                res.send({
                    success: false,
                    messages: "need an avatar"
                });
            } else {
                console.log(result);
                const formData = {
                    email: req.body.email,
                    name: req.body.name,
                    avatar: result.url,
                    password: req.body.password
                };
                axios.post(process.env.LOGIN_API_URL + "/user", formData).then(function () {
                    console.log("ok")
                },function (err) {
                    console.log(err);
                })
            }
        })

    }
};

module.exports = userController;