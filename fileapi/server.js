var express = require("express");
var bodyParser = require("body-parser");
var multipart = require("connect-multiparty");
var path = require('path')
var multipartMiddleware = multipart();
var fs = require("fs");

var app = express();
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

app.post("/", multipartMiddleware, function(req, res) {
  var time = new Date();
  var url = "/picture/" + time.getTime() + path.extname(req.files.url.path)
  fs.rename(
    req.files.url.path,
    "./public" + url,
    function() {
      res.send({
          success: true,
          url
      })
    }
  );
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
  console.log("file-api is on");
});
