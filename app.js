var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appList = require('./core/applist');
var config = require('./core/config');
var markdown = require('markdown-js');

var app = express();
//set port
app.set('port',3001);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser({
    limit: 1000000*20  //1m
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * load Apps
 * */
var appRouter = {};
for(var i=0;i<appList.length;i++){
    appRouter[appList[i]] = require('./routes/'+appList[i]);
    if(appList[i]==='index'){
        app.use('/', appRouter[appList[i]]);
    }else{
        app.use('/'+appList[i], appRouter[appList[i]]);
    }
}
/*var routes = require('./routes/index'),
    user = require('./routes/user'),
    api = require('./routes/api');*/
/*app.use('/', routes);
app.use('/user', user);
app.use('/api',api);*/

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
        res.render('404',{
            title:'404错误',
            path:req.path,
            errorname:'404',
        })
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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
