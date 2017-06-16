var adminController = {
    index: function (req, res) {
        if(!req.user.admin){
            req.flash("info","only admin access that page");
            res.redirect('/');
            return;
        }
        res.render('admin', {
            page: 'admin',
            url: process.env.FRONT_END_SYSTEM_API_URL
        })
    }
};

module.exports = adminController;