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
    url: req.body.url,
    user: req.body.id
  });
  post
    .save()
    .then(function(post) {
      axios
        .post(process.env.BACK_END_RELATION_URL + "/post", {
          _id: post._id,
          user: req.body.id
        })
        .then(function(response) {
          if (!response.data.success) {
            console.log(err);
          }
          res.send({
            success: true,
            post
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
router.get("/friend", function(req, res) {
  axios
    .post(process.env.BACK_END_RELATION_URL + "/post/findFriendPost", {
      id: req.query.id
    })
    .then(function(response) {
      console.log(response.data.id);
      Post.find({
        _id: {
          $in: response.data.id
        }
      }).then(function(posts) {
        res.send({
          success: true,
          posts
        })
      });
    }).catch(function(err){
      console.log(err);
      res.send({
        success: false
      })
    });
});
router.get("/follow", function(req, res) {
  axios
    .post(process.env.BACK_END_RELATION_URL + "/post/findFollowPost", {
      id: req.query.id
    })
    .then(function(response) {
      console.log(response.data.id);
      Post.find({
        _id: {
          $in: response.data.id
        }
      }).then(function(posts) {
        res.send({
          success: true,
          posts
        })
      });
    }).catch(function(err){
      console.log(err);
      res.send({
        success: false
      })
    });
});
router.post("/:id", function(req, res) {
  Post.findById(req.params.id)
    .then(function(post) {
      axios
        .post(process.env.BACK_END_RELATION_URL + "/post/findCreator", {
          _id: post._id
        })
        .then(function(response) {
          if (!response.data.success) {
            console.log(err);
          }
          User.findById(response.data.id).then(function(user) {
            res.send({
              success: true,
              user,
              post
            });
          });
        });
    })
    .catch(function(err) {
      console.log(err);
      res.send({
        success: false
      });
    });
});

module.exports = router;
