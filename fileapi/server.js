var express = require("express");
var bodyParser = require("body-parser");
var multipart = require("connect-multiparty");
var path = require('path')
var multipartMiddleware = multipart();
var fs = require("fs");

const session = require("express-session");
const passport = require("passport");
var redis = require("redis");
var redisStore = require("connect-redis")(session);
var axios = require("axios");

var client  = redis.createClient(6379, process.env.DATABASE2_HOST );
var app = express();
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_SIDE_URL);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Credentials","true")
  res.header("Access-Control-Allow-Headers", 'Content-Type, Content-Range, Content-Disposition, Content-Description');
  next();
};
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: client }),
    resave: false,
    saveUninitialized: false,
    maxAge: null
  })
);
passport.deserializeUser(function (_id, done) {
    axios
        .get(process.env.BACK_END_LOGIN_API_URL + '/user?id=' + _id)
        .then(function (response) {
            done(null, response.data);
        }, function (err, response) {
            done(err, response.data);
        });
});
app.use(passport.initialize());
app.use(passport.session());



app.post("/", multipartMiddleware, function(req, res) {
  if (!req.user) {
    res.status(401).send({
      success: false,
      message: "need to login"
    });
    return
   }
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
