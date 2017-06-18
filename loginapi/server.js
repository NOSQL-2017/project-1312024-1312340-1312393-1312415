require("./db/mongoose");
var express = require("express");
var bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
var redis = require("redis");
var redisStore = require("connect-redis")(session);
var axios = require("axios");

var User = require("./models/User");
var user = require("./routes/user");
var login = require("./routes/login");
var friend = require("./routes/friend");
var post = require("./routes/post");

var app = express();
var client = redis.createClient(6379, process.env.DATABASE2_HOST);
var allowCrossDomain = function(req, res, next) {
  var allowedOrigins = [
    process.env.CLIENT_SIDE_URL,
    process.env.BACK_END_RELATION_URL,
    process.env.BACK_END_SYSTEM_URL,
    process.env.BACK_END_FILE_URL
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
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
    secret: process.env.SESSION_SECRET || "secret",
    store: new redisStore({ client: client }),
    resave: false,
    saveUninitialized: false,
    maxAge: null
  })
);
passport.deserializeUser(function(_id, done) {
  User.findById(_id).then(
    function(user) {
      done(null, user);
    },
    function(err, response) {
      done(err, response.data);
    }
  );
});
app.use(passport.initialize());
app.use(passport.session());
var Authentication = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.send({ success: false, message: "need to login" });
    return;
  } else {
    next();
  }
};

app.use("/user", user);
app.use("/login", login);
app.use("/friend", Authentication, friend);
app.use("/post", Authentication, post);

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
  console.log("login-api is on");
});
