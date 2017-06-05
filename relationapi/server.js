var express = require('express');
var bodyParser = require('body-parser');
var friend = require('./routes/friend');

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



app.set('port', (process.env.PORT || 3000));
app.use('/friend', friend);
app.listen(app.get('port'), function(){
    console.log('relation api is on');
});