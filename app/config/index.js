module.exports = function(app){
    require('./middlewares')(app);
    require('./handlebar')(app);
    require('./routes')(app);
};