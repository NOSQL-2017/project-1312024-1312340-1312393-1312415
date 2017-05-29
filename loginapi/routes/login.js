var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/User');

router.get('/', function (req, res) {
    var text = [];
    text.push(req.query.text);
    res.render('login', {
        page: 'login',
        notices: text
    })
});
router.post('/', function (req, res) {
    var body = _.pick(req.body, ['email', 'password', 'name']);
    if (body) {
        User.findOne(body).then(function (user) {
            if (user) {
                req.session.user_id = user.id;
                res.redirect('/');
            } else {
                res.render('login', {
                    page: 'login',
                    notices: ["wrong email or password "]
                })
            }
        }).catch(function (e) {
            res.send(e);
        })
    }

});

module.exports = router;