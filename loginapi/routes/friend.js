var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');


router.get('/', function (req, res) {
    var friends = [];
    var others = [];
    User.findById(req.query.id).then(function (user) {
        User
            .find({
                _id: {
                    $in: user.friends,
                    $ne: user._id
                }
            })
            .then(function (users) {
                friends = users;
                return User.find({
                    _id: {
                        $nin: user.friends,
                        $ne: user._id
                    }
                })
            })
            .then(function (users) {
                others = users;
                res.send({
                    friends,
                    others
                })
            })
    })
});
router.post('/add', function (req, res) {
    User.findById(req.body.id).then(function (user) {
        user.friends.push(req.body.friendId);
        user.save();
        return User.findById(req.body.friendId)
    }).then(function (user) {
        user.friends.push(req.body.id);
        user.save().then(function () {
            res.send({success: true})
        })
    })

});
router.post('/remove', function (req, res) {
    User.findById(req.body.id).then(function (user) {
        user.friends = user.friends.filter(function(el) {
            return el._id === req.body.friendId;
        });
        user.save();
        return User.findById(req.body.friendId)
    }).then(function (user) {
        user.friends = user.friends.filter(function(el) {
            return el._id === req.body.id;
        });
        user.save().then(function () {
            res.send({success: true})
        })
    })

});

module.exports = router;
