var Authentication = function (req,res,next) {
    if(req.isAuthenticated()){
        res.locals.session = req.user;
        next();
    }else{
        req.flash('info','need to login');
        res.redirect('/user/login');
    }
};

module.exports = Authentication;