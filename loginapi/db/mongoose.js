var mongoose = require("mongoose");
var sleep = require('sleep');
var axios = require('axios');
mongoose.Promise = global.Promise;

function connection() {
  mongoose
    .connect(process.env.DATABASE1_URL)
    .then(() => {
      var User = require('../models/User');
      console.log("connected to database");
      User.findOne({
        email: "admin@gmail.com"
      }).then((user) => {
        if (!user) {
          var user = new User({
            email: "admin@gmail.com",
            password: "123456",
            name: "admin",
            avatar: "http://res.cloudinary.com/du27rtoxp/image/upload/v1498145007/fpdvg86j0rjrcxhshaoc.png",
            admin: true
          })
          user.save().then(function (user) {
            return axios.post(process.env.BACK_END_RELATION_URL + '/friend', user)
          }).then(function (response) {
            if (!response.data.success) {
              console.log(err)
            }
          }).catch(function (params) {
            console.log(params);
          });
        }
      });
    })
    .catch(function (e) {
      console.log("waiting ");
      sleep.sleep(3)
      connection();
      return;
    });
}
connection();