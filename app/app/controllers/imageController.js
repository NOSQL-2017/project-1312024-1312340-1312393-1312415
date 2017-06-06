
var imageController = {
    index: function (req, res) {
        res.render('image/index', {
            page: 'image',
            url: process.env.FRONT_END_LOGIN_API_URL,
            url2: process.env.FRONT_END_FILE_API_URL
        })
    }
};

module.exports = imageController;
