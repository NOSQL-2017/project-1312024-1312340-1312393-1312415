var express = require("express");
var _ = require("lodash");
var fs = require("fs");
var axios = require("axios");
var db = require("seraph")(process.env.DATABASE3_URL);

var router = express.Router();
router.post("/", function(req, res) {
  try {
    db.save({ PostId: req.body._id }, function(err, node) {
      if (err) {
        res.send({
          success: false,
          message: err.message
        });
        return;
      }
      console.log("Post inserted.");
      db.label(node, "Post", function(err, node) {});
      var cypher = `START n=node(*), m=node(*)  where n.UserId = '${req.body
        .user}' and m.PostId = '${req.body._id}' create (n)-[:CREATED]->(m)`;
      db.query(cypher, {}, function(err, result2) {
        res.send({
          success: true
        });
      });
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});
router.post("/findCreator", function(req, res) {
  try {
    var cypher = `MATCH (n)-[:CREATED]->(m)  where m.PostId = '${req.body
      ._id}' return n.UserId`;
    console.log(cypher);
    db.query(cypher, {}, function(err, results) {
      var userId;
      results.map(function(result) {
        userId = result["n.UserId"];
      });
      res.send({
        success: true,
        id: userId
      });
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});
router.post("/findFriendPost", function(req, res) {
  try {
    var cypher = `MATCH (b:User {UserId:'${req.body
      .id}'})-[:IS_FRIEND_WITH] -> (n:User)-[:CREATED]->(m)   return m.PostId`;
    console.log(cypher);
    db.query(cypher, {}, function(err, results) {
      var postId = [];
      results.map(function(result) {
        postId.push(result["m.PostId"]);
      });
      res.send({
        success: true,
        id: postId
      });
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});
router.post("/findFollowPost", function(req, res) {
  try {
    var cypher = `MATCH (b:User {UserId:'${req.body
      .id}'})-[:FOLLOW] -> (n:User)-[:CREATED]->(m)   return m.PostId`;
    console.log(cypher);
    db.query(cypher, {}, function(err, results) {
      var postId = [];
      results.map(function(result) {
        postId.push(result["m.PostId"]);
      });
      res.send({
        success: true,
        id: postId
      });
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});
module.exports = router;
