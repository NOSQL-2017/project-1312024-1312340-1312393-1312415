var Strategy = require('passport-local').Strategy;
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var axios = require('axios');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
    axios
        .get(process.env.BACK_END_LOGIN_API_URL + '/user?id=' + _id)
        .then(function (response) {
            done(null, response.data);
        }, function (err, response) {
            done(err, response.data);
        });
});
passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOKCALLBACK,
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'photos', 'email', 'friends']
    },
    function (req, accessToken, refreshToken, profile, cb) {
        var email = false;
        axios.post(process.env.BACK_END_LOGIN_API_URL + "/user/find", {email: profile.emails[0].value})
            .then(function (res) {
                var data = res.data;
                if (data.user) {
                    email = true;
                    return cb(null, data.user, req.flash('info', 'welcome back'));
                } else {
                    return axios.post(process.env.BACK_END_LOGIN_API_URL + "/user/find", {facebookId: profile.id});
                }
            })
            .then(function (res) {
                console.log(res.data);
                if (email) {
                    return;
                }
                if (res.data.user) {
                    return cb(null, res.data.user, req.flash('info', 'welcome back'));
                } else {
                    user = {
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    };
                    axios.post(process.env.BACK_END_LOGIN_API_URL + "/user/build", user).then(function (response) {
                        return cb(null, response.data.user, req.flash('info', 'Welcome from facebook'));
                    });
                }
            })

    }));
passport.use(new Strategy({passReqToCallback: true}, function (req, email, password, cb) {
    axios.post(process.env.BACK_END_LOGIN_API_URL + "/login", {
        data: {
            email,
            password
        }
    }).then(function (response) {
        
        if (response.data.success) {
            return cb(null, response.data.user, req.flash('info', 'welcome back'));
        } else {
            return cb(null, false, req.flash('info', 'wrong email or password'));
        }
    })

}));
module.exports = passport;
