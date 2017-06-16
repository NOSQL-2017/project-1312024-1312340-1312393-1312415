const axios = require('axios');
var indexController = {
    index: function (req, res) {
        if (req.isAuthenticated()) {
            res.locals.session = req.user;
            res.render('index', {
                page: 'index'
            })

        } else {
            res.render('index', {
                page: 'index'
            })
        }
    }


};

module.exports = indexController;
