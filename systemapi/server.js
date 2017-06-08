var express = require('express');
var bodyParser = require('body-parser');
var data = require("./routes/data");


var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(allowCrossDomain);


app.use('/data', data);



app.listen('3000', function(){
    console.log('system api is on');
});