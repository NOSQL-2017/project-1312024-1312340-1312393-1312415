require('./db/mongoose');
var express = require('express');
var bodyParser = require('body-parser');

var user = require('./routes/user');
var login = require('./routes/login');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/user', user);
app.use('/login',login);







app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('login-api is on');
});