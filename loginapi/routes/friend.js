var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');
var axios = require('axios');

router.get('/', function (req, res) {
    var friends = [];
    var others = [];
    axios.post(process.env.BACK_END_RELATION_URL + '/friend/get', {id: req.query.id}).then(function (response) {
        if (!response.data.success) {
            console.log(response.data.err);
            return
        }
        User.findById(req.query.id).then(function (user) {
            User
                .find({
                    _id: {
                        $in: response.data.friends,
                        $ne: user._id
                    }
                })
                .then(function (users) {
                    friends = users;
                    return User.find({
                        _id: {
                            $nin: response.data.friends,
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

});


module.exports = router;
