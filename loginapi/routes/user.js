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
            res.send(user);
        }, function (err) {
            res.send(null);
        })

});

module.exports = router;