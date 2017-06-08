var express = require("express");
var _ = require("lodash");
var fs = require("fs");
var axios = require("axios");
var models = require("../db/connection");
var router = express.Router();
router.post("/", function(req, res) {
  var body = _.pick(req.body, [
    "id",
    "ip",
    "country_code",
    "country_name",
    "city",
    "latitude",
    "longitude",
    "service"
  ]);
  console.log(body);
  var data = new models.instance.Data(body);
  var time = new Date();
  data.id = time.getTime() + "t";
  data.save(function(err) {
    if (err) {
      console.log(err);
      res.send({
          success: false
      })
      return;
    }
    res.send({
          success: true
      })
  });
});
module.exports = router;
