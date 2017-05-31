var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');

router.post('/', function (req, res) {
    var body = _.pick(req.body.data, ['email', 'password']);
    if (body) {
        User.findOne(body).then(function (user) {
            res.send(user);
        }).catch(function (e) {
            res.send(e);
        })
    }

});

module.exports = router;