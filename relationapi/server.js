var express = require("express");
var bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
var redis = require("redis");
var redisStore = require("connect-redis")(session);
var axios = require("axios");

var friend = require("./routes/friend");
var post = require("./routes/post");
var follow = require("./routes/follow");

var app = express();
var client = redis.createClient(6379, process.env.DATABASE2_HOST);
var allowCrossDomain = function(req, res, next) {
  var allowedOrigins = [
    process.env.CLIENT_SIDE_URL,
    process.env.BACK_END_LOGIN_API_URL
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    req.origin = origin;
  }
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Range, Content-Disposition, Content-Description"
  );
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

app.set("port", process.env.PORT || 3000);
app.use("/friend", friend);
app.use("/follow", follow);
app.use("/post", post);
app.listen(app.get("port"), function() {
  console.log("relation api is on");
});
