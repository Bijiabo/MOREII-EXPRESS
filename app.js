var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    GithubStrategy = require('passport-github').Strategy,
    csrf = require('csurf'),
    cookieparser = cookieParser();
//set config
global.config = require('./core/config');
//require user
global.userSchema = require('./core/schema/user');
//get app
global.app = express();
var server = require('http').createServer(app);
global.io = require('socket.io')(server);
server.listen(Number(global.config.port)+1);
var cookie = require('cookie'),
    cookieSignature = require('cookie-signature');
global.io.use(function (socket, next) {
    var handshakeData = socket.request;
    if (handshakeData.headers.cookie) {
        var cookieCache = cookie.parse(handshakeData.headers.cookie);
        if(cookieCache.session){
            var sid = cookieSignature.unsign(cookieCache.session.slice(2),'speedyCat'),
                mongoSession = global.userSchema.session();
            mongoSession.get(sid,function(err,sessionResult){
                if(err){
//                return callback(err,false);
                }else{
                    handshakeData.session = sessionResult;
//                return callback(null,true);
                }
                next();
            });
        }else{
            next();
        }
    } else {
//        callback('no session',false);
        next();
    }
//    callback(null, true);
});
//session.socket.io
//var SessionSockets = require('session.socket.io'),
//    sessionSockets = new SessionSockets(global.io, global.userSchema.session(), cookieparser);
//get mongoose schema
var site = require('./core/schema/site'),
    markdown = require('markdown-js');
//var app = express(),
// var router = express.Router();
//set port
app.set('port',3001);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy',true);
app.set('env','production');//development
//app.set('env','development');//development

app.use(bodyParser({
    limit: 1000000*20  //1m
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieparser);
app.use(session({
    key: 'session',
    secret: 'speedyCat',
    cookie: {
        secure: false,
        maxAge: 3600000*24,
        httpOnly:true
    },
    store:global.userSchema.session()
}));
app.use(csrf());
app.use(express.static(path.join(__dirname, 'public')));
/**
 * 验证登陆 & 权限
 * */
app.use(function(req,res,next){
    res.set({
        'X-Powered-By': 'Moreii',
        'Version':'0.0.2'
    });
    global.userSchema.checkLogin(req,res,function(login,userData){
        if(login){
            req.login = true;
            req.userData = userData;
            res.locals.login = true;
            res.locals.userData = userData;

        }else{
            req.login = false;
            req.userData = false;
            res.locals.login = false;
            res.locals.userData = false;
        }
        res.locals.nav = global.config.nav;
        res.locals.apps = global.config.app;
        res.locals.pretty = true;
        res.locals.domain = global.config.domain;
        res.locals.port = global.config.port;
        res.locals.siteUrl = global.config.siteUrl;
        res.locals.logo = global.config.logo;
        res.locals.logoImage = global.config.logoImage;
        res.locals.logoImageResize = global.config.logoImageResize;
        res.locals.footerInfo = global.config.footerInfo;
        app.locals.csrf = req.csrfToken();
        next();
    });

//    console.log(process.memoryUsage().heapUsed/1024/1024);
});
/**
 * load Apps
 * */
var appRouter = {};
for(var item in config.app){
//    if(config.app[item].state===1){
        appRouter[item] = require('./routes/'+config.app[item].name);
        app.use('/'+config.app[item].path,appRouter[item]);
//    }
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
            errorname:'500'
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
        errorname:'404'
    })
});
module.exports = app;