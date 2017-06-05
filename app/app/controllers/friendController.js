var axios = require('axios');
var fs = require('fs');

var friendController = {
    index: function (req, res) {
        res.render("friend",{
            page: "friend",
            url: process.env.FRONT_END_LOGIN_API_URL,
            url2: process.env.FRONT_END_RELATION_URL
        })
    }
};

module.exports = friendController;
