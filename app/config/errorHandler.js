module.exports = function(app){
    app.use(function(req, res, next) {
        var err = new Error('Page Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err.status || 500,
            layout: false
        });
    });
};