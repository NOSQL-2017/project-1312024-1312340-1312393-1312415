var express = require('express')
var router = express.Router()
var _ = require('lodash')
var User = require('../models/User')

router.post('/', function (req, res) {
  if (req.body.data.email) {
    User.findOne({email: req.body.data.email}).then(function (user) {
      if (user && user.password === req.body.data.password) {
        user = {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email
        }
        res.send({user, success: true})
        return
      }
      res.send({success: false})
    }).catch(function (e) {
      res.status(500).send({success: false})
    })
  }
})

module.exports = router
