const axios = require('axios');
var indexController = {
    index: function (req, res) {
        if (req.isAuthenticated()) {
            res.locals.session = req.user;
            res.render('index', {
                page: 'index',
                url: process.env.FRONT_END_RELATION_URL,
                url2: process.env.FRONT_END_LOGIN_API_URL
            })

        } else {
            res.render('index', {
                page: 'index'
            })
        }
    }


};

module.exports = indexController;
