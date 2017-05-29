var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE1_URL)
    .then(
        console.log('connected to database'))
    .catch(function (e) {
        console.log('error: ' + e);
    });