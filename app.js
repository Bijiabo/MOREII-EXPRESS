var express = require('express'),
    expressSession = require('express-session'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
//var appList = require('./core/applist');
var config = require('./core/config'),
    site = require('./core/schema/site'),
    markdown = require('markdown-js');

global.app = express();
//var app = express(),
  var router = express.Router();
//set port
app.set('port',3001);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy',true);
app.set('env','production');

app.use(bodyParser({
    limit: 1000000*20  //1m
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(expressSession({secret: 'speedyCat'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    res.set({
        'X-Powered-By': 'Moreii',
        'Version':'0.0.2'
    });
    next();
});
/**
 * load Apps
 * */
var appRouter = {};
for(var i=0;i<config.app.length;i++){
    if(config.app[i].state===1){
        appRouter[config.app[i].name] = require('./routes/'+config.app[i].name);
        app.use('/'+config.app[i].path, appRouter[config.app[i].name]);
    }
}
app._router.stack[app._router.stack.length-6].regexp = new RegExp('^\/blogs\/?(?=/|$)','i');
//console.log(app._router.stack[app._router.stack.length-6]);
config.changeRoute(app);
app.get('/stack', function(req, res) {
    res.json({
        stack : app._router.stack[10]
    });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        /*res.render('error', {
            message: err.message,
            error: err
        });*/
        res.render('500',{
            title:'500错误',
            path:req.path,
            errorname:'500',
        })
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 404);
    /*res.render('error', {
        message: err.message,
        error: {}
    });*/
    res.render('404',{
        title:'404错误',
        path:req.path,
        errorname:'404',
    })
});

module.exports = app;
