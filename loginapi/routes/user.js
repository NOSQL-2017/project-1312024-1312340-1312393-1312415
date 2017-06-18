var express = require('express');
var _ = require('lodash');
var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var axios = require('axios');

cloudinary.config({
    cloud_name: 'du27rtoxp',
    api_key: '961163633288279',
    api_secret: 'E40LT_jwdgycmLksE37Gql21E5M'
});

var User = require('../models/User');

var router = express.Router();
var userBodyHandle = function (req, res, result) {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: result.url
    });
    user.save().then(function (user) {
        axios.post(process.env.BACK_END_RELATION_URL + '/friend', user).then(function (response) {
            if(!response.data.success){
                console.log(err);
            }
        });
        res.send({
            success: true,
            user: user
        })


    }).catch(function (e) {

        var messages = [];
        if (e.errors.avatar) {
            messages.push(e.errors.avatar.message);
        }
        if (e.errors.password) {
            messages.push(e.errors.password.message);
        }
        if (e.errors.email) {
            messages.push(e.errors.email.message);
        }
        if (e.errors.name) {
            messages.push(e.errors.name.message);
        }
        res.send({
            success: false,
            messages
        })
    });
}
router.post('/', multipartMiddleware, function (req, res) {
    if (!req.files.avatar) {
        res.send({
            success: false,
            messages: ["need an avatar"]
        });
    }
    cloudinary.uploader.upload(req.files.avatar.path, function (result) {
        fs.unlinkSync(req.files.avatar.path);

        if (!result) {
            res.send({
                success: false,
                messages: ["need an avatar"]
            });
        } else {
            userBodyHandle(req, res, result);
        }
    })

});
router.get('/', function (req, res) {
    User
        .findById(req.query.id)
        .then(function (user) {
            var result = {
                name: user.name,
                avatar: user.avatar,
                email: user.email
            }
            res.send({
                result
            });
        }, function (err) {
            res.send(null);
        })

});
router.post('/find', function (req, res) {
    User.findOne(req.body)
        .then(function (user) {
            var result = {
                name: user.name,
                avatar: user.avatar,
                email: user.email
            }
            res.send({
                result
            });
        }).catch(function (err) {
        res.send({
            user: null
        });
    })
});
router.post('/build', function (req, res) {
    var user = new User(req.body);
    user.password = user.facebookId;
    user.save().then(function (user) {
        axios.post(process.env.BACK_END_RELATION_URL + '/friend', user).then(function (response) {
            if(!response.data.success){
                console.log(err);
            }
        });
        res.send({user});
    }).catch(function (err) {

        res.send({
            user: null
        });
    })
});

module.exports = router;