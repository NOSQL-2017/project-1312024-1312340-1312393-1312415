var express = require('express');
var _ = require('lodash');
var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

cloudinary.config({
    cloud_name: 'du27rtoxp',
    api_key: '961163633288279',
    api_secret: 'E40LT_jwdgycmLksE37Gql21E5M'
});

var User = require('../models/User');

var router = express.Router();
var userBodyHandle = function (req, res, result) {
    var user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        avatar: result.url
    });

    user.save().then(function (user) {
        req.session.user_id = user.id;
        req.session.save();
        res.send({
            success: true
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
router.post('/', function (req, res) {
    console.log(req.body);
    // cloudinary.uploader.upload(req.files.avatar.path, function(result) {
    //     if(!result){
    //         res.send({
    //             success: false,
    //             messages: "need an avatar"
    //         });
    //     }else{
    //         userBodyHandle(req, res, result);
    //     }
    // })

});
router.get('/', multipartMiddleware, function (req, res) {
    res.send("hello");
});

module.exports = router;