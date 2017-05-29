const axios = require('axios');
var indexController = {
    index: function (req, res) {
        console.log(process.env.LOGIN_API_URL + "/user");
        axios.get(process.env.LOGIN_API_URL + "/user").then(function (res) {
            console.log(res.data);
        });
        res.render('index', {
            page: 'index'
        })
    }
};

module.exports = indexController;
