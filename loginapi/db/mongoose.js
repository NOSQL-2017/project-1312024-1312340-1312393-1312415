var mongoose = require("mongoose");
var sleep = require('sleep');

mongoose.Promise = global.Promise;
function connection() {
  mongoose
    .connect(process.env.DATABASE1_URL)
    .then(console.log("connected to database"))
    .catch(function(e) {
      console.log("waiting ");
      sleep.sleep(3)
      connection();
      return;
    });
}
connection();
