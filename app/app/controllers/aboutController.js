var aboutController = {
    index: function (req, res) {
        res.render('about', {
            page: 'about'
        })
    }
};

module.exports = aboutController;
