var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');

router.post('/', function (req, res) {
    if (req.body.data.email) {
        User.findOne({email: req.body.data.email}).then(function (user) {
            if(user && user.password === req.body.data.password){
                res.send({user, success: true});
                return;
            }
            res.send({success: false});
        }).catch(function (e) {
            res.send({success: false});
        })
    }

});

module.exports = router;