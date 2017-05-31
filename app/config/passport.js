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
// passport.use(new facebookStrategy({
//         clientID: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         callbackURL: process.env.FACEBOOKCALLBACK,
//         passReqToCallback: true,
//         profileFields: ['id', 'displayName', 'photos', 'email', 'friends']
//     },
//     function (req, accessToken, refreshToken, profile, cb) {
//         var email = false;
//         User.findOne({where: {email: profile.emails[0].value}})
//             .then(function (user) {
//                 if (user != null) {
//                     email = true;
//                     return cb(null, user, req.flash('info', 'welcome back'));
//                 } else {
//                     return User.findOne({where: {facebookId: profile.id}});
//                 }
//             })
//             .then(function (user) {
//                 if (email) {
//                     return;
//                 }
//                 if (user != null) {
//                     return cb(null, user, req.flash('info', 'welcome back'));
//                 } else {
//                     user = User.build({
//                         facebookId: profile.id,
//                         name: profile.displayName,
//                         email: profile.emails[0].value,
//                         avatar: profile.photos[0].value
//                     });
//                     user.save().then(function (user) {
//                         return cb(null, user, req.flash('info', 'Welcome from facebook'));
//                     })
//                 }
//             })
//
//     }));
passport.use(new Strategy({passReqToCallback: true}, function (req, email, password, cb) {
    axios.post(process.env.BACK_END_LOGIN_API_URL + "/login", {
        data: {
            email,
            password
        }
    }).then(function (response) {
        if (response.data) {
            return cb(null, response.data, req.flash('info', 'welcome back'));
        } else {
            console.log("not ok");
        }
    })

}));
module.exports = passport;
