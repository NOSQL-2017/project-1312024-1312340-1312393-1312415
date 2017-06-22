var express = require("express");
var _ = require("lodash");
var fs = require("fs");
var axios = require("axios");
var db = require("seraph")(process.env.DATABASE3_URL);
const Paypal = require("paypal-express-checkout");
const paypal = Paypal.init(
  "idkwayta2-facilitator_api1.gmail.com",
  "TNB4PQSPU3V752EB",
  "AFcWxV21C7fd0v3bYYYRCpSSRl31AxKYhqoLdhcq-LL0ZJxEqndFi0Rn",
  "http://localhost:3002/buy/",
  "http://localhost:3002/buy/",
  true
);

var router = express.Router();
router.post("/check", function(req, res) {
  try {
    if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }

    var cypher = `MATCH  (p:User {UserId: '${req.user
      ._id}'}), (b:Post {PostId: '${req.body
      .buyId}'}) RETURN EXISTS( (p)-[:BUY]->(b) )`;
      console.log(cypher)
    db.query(cypher, {}, function(err, result) {
      res.send({
        success: true,
        check: result[0]["EXISTS( (p)-[:BUY]->(b) )"]
      });
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.message
    });
  }
});
router.post("/", function(req, res) {
  try {
    if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
    paypal.pay(
      req.user._id + "-" + req.body.buyId,
      req.body.price,
      "Image",
      "USD",
      true,
      function(e, url) {
        if (e) {
          res.send({
            success: false,
            message: e.message
          });
          return;
        }
        res.send({
          success: true,
          url
        });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: e.message
    });
  }
});
router.get("/", function(req, res) {
  try {
    if (req.query.token && req.query.PayerID) {
      paypal.detail(req.query.token, req.query.PayerID, function(
        err,
        data,
        invoiceNumber,
        price
      ) {
        if (!err) {
          if (data.success) {
            var i = invoiceNumber.indexOf("-");
            var UserId = invoiceNumber.slice(0, i).trim();
            var PostId = invoiceNumber
              .slice(i + 1, invoiceNumber.length)
              .trim();
            var cypher = `MATCH  (p:User {UserId: '${UserId}'}), (b:Post {PostId: '${PostId}'}) CREATE  (p)-[:BUY{token:'${req.query.token}', PayerID:'${req.query.PayerID}', price: ${price}}]->(b) `;
            console.log(cypher);
            db.query(cypher, {}, function(err, result) {});
          }
        }
        res.redirect("http://localhost:3000/image/"+PostId);
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: e.message
    });
  }
});
module.exports = router;
