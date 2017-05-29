const User = require('./models/User');

var authenticate = function (req, res, next) {
    var session = req.session.user_id;
    if(session){
        User.findById(req.session.user_id).then(function (user) {
            req.user = user;
            res.locals.session = user;
            next();
        }).catch(function (e) {
            res.send(e);
        })
    }
    else{
        var string = encodeURIComponent('need to login');
        res.redirect('/login?text=' + string);
    }

};
module.exports = authenticate;