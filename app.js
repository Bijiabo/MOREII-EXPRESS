var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    GithubStrategy = require('passport-github').Strategy;
//set config
global.config = require('./core/config');
//get mongoose schema
var site = require('./core/schema/site'),
    userSchema = require('./core/schema/user'),
    markdown = require('markdown-js');
//get app
global.app = express();
//var app = express(),
// var router = express.Router();
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
app.use(session({
    key: 'session',
    secret: 'speedyCat',
    cookie: {
        secure: false,
        maxAge: 3600000,
        httpOnly:true
    },
    store:userSchema.session()
}));
app.use(express.static(path.join(__dirname, 'public')));
/**
 * 验证登陆 & 权限
 * */
app.use(function(req,res,next){
    console.log(req.sessionID);
    res.set({
        'X-Powered-By': 'Moreii',
        'Version':'0.0.2'
    });
    userSchema.checkLogin(req,res,function(login,userData){
        if(login){
            req.login = true;
            req.userData = userData;
            next();
        }else{
            req.login = false;
            req.userData = false;
            next();
        }
    });
//    console.log(process.memoryUsage().heapUsed/1024/1024);
});
/**
 * load Apps
 * */
var appRouter = {};
for(var item in config.app){
    if(config.app[item].state===1){
        appRouter[item] = require('./routes/'+config.app[item].name);
        app.use('/'+config.app[item].path,appRouter[item]);
    }
}
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
        });
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
