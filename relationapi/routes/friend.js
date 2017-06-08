var express = require('express');
var _ = require('lodash');
var fs = require('fs');
var axios = require('axios');
var db = require("seraph")(process.env.DATABASE3_URL);

var router = express.Router();
router.post('/', function (req, res) {
    db.save({email: req.body.email, UserId: req.body._id}, function (err, node) {
        if (err) {
            res.send({
                success: false,
                err: err
            });
            return;
        }
        console.log(req.body.email + " inserted.");
        db.label(node, 'User', function (err, node) {
            res.send({
                success: true
            });
        });

    });
});
router.post('/get', function (req, res) {
    var cypher = "MATCH (n) - [:IS_FRIEND_WITH] - (x)"
        + " WHERE n.UserId ='"
        + req.body.id
        + "' RETURN x.UserId  ";
    var friends = [];

    db.query(cypher, {}, function (err, results) {
        results.map(function (result) {
            var a = result['x.UserId'];
            friends.push(a);
        });
        res.send({
            success: true,
            friends
        })
    });

});
router.post('/add', function (req, res) {

    var cypher1 = "MATCH (n)"
        + " WHERE labels(n)='User' and n.UserId ='"
        + req.body.id
        + "' RETURN n ";
    var cypher2 = "MATCH (n)"
        + " WHERE labels(n)='User' and n.UserId ='"
        + req.body.friendId
        + "' RETURN n ";
    db.query(cypher1, {}, function (err, result1) {
        if (err) {
            res.send({
                success: false,
                err
            });
            return
        }
        db.query(cypher2, {}, function (err, result2) {
            if (err) {
                res.send({
                    success: false,
                    err
                });
                return;
            }
            db.relate(result1[0].id, 'IS_FRIEND_WITH', result2[0].id, {}, function (err, relationship) {
                if (err) {
                    res.send({
                        success: false,
                        err
                    });
                    return;
                }
                res.send({
                    success: true
                })
            });

        });
    });
});
router.post('/remove', function (req, res) {
    var cypher = "MATCH (n)-[rel:IS_FRIEND_WITH]-(r) WHERE n.UserId='" + req.body.id + "'AND r.UserId='" + req.body.friendId + "' DELETE rel";
    db.query(cypher, {}, function (err, result1) {
        if (err) {
            res.send({
                success: false,
                err
            });
            return
        }

        res.send({
            success: true
        })

    });
});
module.exports = router;