var express = require("express");
var fs = require("fs");
var axios = require("axios");
var multipart = require("connect-multiparty");
var User = require("../models/User");
var Post = require("../models/Post");

var multipartMiddleware = multipart();
var router = express.Router();

router.post("/getPosts", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return;
  }
  Post.find({
    _id: {
      $in: req.body.id
    }
  })
    .then(function(posts) {
      res.send({
        success: true,
        posts
      });
    })
    .catch(function(err) {
      res.status(500).send({
        success: false,
        message: err.message
      });
    });
});
router.post("/", multipartMiddleware, function(req, res) {
   if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
  var post = new Post({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    user: req.user.id,
    price: req.body.price
  });
  post
    .save()
    .then(function(post) {
      axios
        .post(process.env.BACK_END_RELATION_URL + "/post", {
          _id: post._id,
          user: req.user.id
        })
        .then(function(response) {
          if (!response.data.success) {
            res.status(500).send({
              success: false,
              messages: response.data.message
            });
            return;
          }
          res.send({
            success: true,
            post
          });
        });
    })
    .catch(function(e) {
      var message;
      if (e.errors.title) {
        message = e.errors.title.message;
      }
      if (e.errors.description) {
        message = e.errors.description.message;
      }
      res.send({
        success: false,
        message
      });
    });
});
router.get("/", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
  Post.find({}).then(posts => {
    res.send({
      success: true,
      posts
    });
  });
});
router.get("/friend", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
  axios
    .post(process.env.BACK_END_RELATION_URL + "/post/findFriendPost", {
      id: req.user.id
    })
    .then(function(response) {
      Post.find({
        _id: {
          $in: response.data.id
        }
      }).then(function(posts) {
        res.send({
          success: true,
          posts
        });
      });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err.message
      });
    });
});
router.get("/follow", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
  axios
    .post(process.env.BACK_END_RELATION_URL + "/post/findFollowPost", {
      id: req.user.id
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
        });
      });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({
        success: false
      });
    });
});
router.post("/:id", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
  Post.findById(req.params.id)
    .then(function(post) {
      axios
        .post(process.env.BACK_END_RELATION_URL + "/post/findCreator", {
          _id: post._id
        })
        .then(function(response) {
          if (!response.data.success) {
            res.send({
              success: false,
              message: response.data.message
            });
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
      res.status(500).send({
        success: false,
        message: err.message
      });
    });
});

module.exports = router;
