var express = require("express");
var _ = require("lodash");
var fs = require("fs");
var axios = require("axios");
var models = require("../db/connection");
var router = express.Router();
router.post("/", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to be login"
    });
    return;
  }
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
  var data = new models.instance.Data(body);
  var time = new Date();
  data.id = time.getTime() + "t";
  data.save(function(err) {
    if (err) {
      console.log(err);
      res.send({
        success: false
      });
      return;
    }
    res.send({
      success: true
    });
  });
});
router.get("/service", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to be login"
    });
    return;
  }
  if (!req.user.admin) {
    res.status(401).send({
      success: false,
      message: "need to be admin"
    });
    return;
  }
  models.instance.Data.find(
    {},
    {
      select: ["service"]
    },
    function(err, results) {
      var service = {};
      results.map(result => {
        if (result.service !== "admin") {
          if (Object.keys(service).indexOf(result.service) !== -1) {
            service[result.service] += 1;
          } else {
            service[result.service] = 1;
          }
        }
      });
      Object.keys(service).map(obj => {
        service[obj] = (service[obj] * 100 / results.length).toFixed(2);
      });
      res.send({ success: true, service });
    }
  );
});
router.get("/countryName", function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to be login"
    });
    return;
  }
  if (!req.user.admin) {
    res.status(401).send({
      success: false,
      message: "need to be admin"
    });
    return;
  }
  models.instance.Data.find(
    {},
    {
      select: ["country_name"]
    },
    function(err, results) {
      var country_name = {};
      if (!results) {
        res.send({
          success: false,
          message: "no result"
        });
      }
      results.map(result => {
        if (Object.keys(country_name).indexOf(result.country_name) !== -1) {
          country_name[result.country_name] += 1;
        } else {
          country_name[result.country_name] = 1;
        }
      });
      Object.keys(country_name).map(obj => {
        country_name[obj] = (country_name[obj] * 100 / results.length).toFixed(
          2
        );
      });
      res.send({ success: true, country_name });
    }
  );
});
module.exports = router;
