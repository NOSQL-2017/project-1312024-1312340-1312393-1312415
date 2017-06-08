var express = require("express");
var _ = require("lodash");
var fs = require("fs");
var axios = require("axios");
var db = require("seraph")(process.env.DATABASE3_URL);

var router = express.Router();
router.post("/check", function(req, res) {
  try {
    var cypher = `MATCH  (p:User {UserId: '${req.body.id}'}), (b:User {UserId: '${req.body.followId}'}) RETURN EXISTS( (p)-[:FOLLOW]->(b) )`;
    db.query(cypher, {}, function(err, result) {
      res.send({
          success: true,
          check: result[0]['EXISTS( (p)-[:FOLLOW]->(b) )']
      })
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false
    });
  }
});
router.post("/",function(req, res){
    try {
    var cypher = `MATCH  (p:User {UserId: '${req.body.id}'}), (b:User {UserId: '${req.body.followId}'}) CREATE  (p)-[:FOLLOW]->(b) `;
    
    db.query(cypher, {}, function(err, result) {
      res.send({
          success: true
      })
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false
    });
  }
})
router.post("/delete",function(req, res){
    try {
    var cypher = `MATCH  (p:User {UserId: '${req.body.id}'}) - [rel:FOLLOW] -> (b:User {UserId: '${req.body.followId}'}) DELETE  (rel) `;
    console.log(cypher);
    db.query(cypher, {}, function(err, result) {
      res.send({
          success: true
      })
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false
    });
  }
})
module.exports = router;
