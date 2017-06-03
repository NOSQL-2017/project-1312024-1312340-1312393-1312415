require('./db/mongoose');
var express = require('express');
var bodyParser = require('body-parser');

var user = require('./routes/user');
var login = require('./routes/login');
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

app.use('/user', user);
app.use('/login',login);
app.use('/friend', friend);


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('login-api is on');
});