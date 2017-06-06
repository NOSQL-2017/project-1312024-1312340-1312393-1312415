var express = require("express");
var fs = require("fs");
var axios = require("axios");
var multipart = require("connect-multiparty");
var User = require("../models/User");
var Post = require("../models/Post");

var multipartMiddleware = multipart();
var router = express.Router();

router.post("/", multipartMiddleware, function(req, res) {
  var post = new Post({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url
  });
  post
    .save()
    .then(function(post) {
      User.findById(req.body.id).then((user) => {
        user.posts.push(post._id);
        user.save();
        res.send({
          success: true,
          post,
          user
        });
      });
    })
    .catch(function(e) {
      var messages = [];
      if (e.errors.title) {
        messages.push(e.errors.title.message);
      }
      if (e.errors.description) {
        messages.push(e.errors.description.message);
      }
      res.send({
        success: false,
        messages
      });
    });
});
router.get("/", function(req, res) {
  Post.find({}).then(posts => {
    res.send({
      success: true,
      posts
    });
  });
});

module.exports = router;
