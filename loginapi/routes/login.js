var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');

router.post('/', function (req, res) {
    var body = _.pick(req.body.data, ['email']);
    if (body) {
        User.findOne(body).then(function (user) {
            if(user.password === body.password){
                res.send(user);
            }
        }).catch(function (e) {
            res.send(e);
        })
    }

});

module.exports = router;