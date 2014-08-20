var express = require('express'),
    fs = require('fs'),
    path=require('path'),
    userSchema = require('../core/schema/user');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii wine';
    this.cssfile = data.cssfile || 'wine.css';
    this.jsfile = data.jsfile ||'';
    this.siteUrl = global.config.siteUrl;
    this.app = 'wine';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
}
/*
* 判断应用状态
* */
router.use(function(req,res,next){
    console.log(global.config.app.wine.state);
    if(global.config.app.wine.state===1){
        console.log(global.config.app.wine);
        next();
    }else{
        res.redirect(global.config.siteUrl+'404');
    }
})
/* GET home page. */
router.get('/', function(req, res) {
    console.log(global.config.app);
    console.log(router.stack);
    var data = new renderData({
        title : 'Moreii Wine',
        jsfile: 'wine.js'
    });
    res.render('wine/index',data);
});
router.get('/test', function(req, res) {
    console.log(global.config.app);
    console.log(router.stack);
    var data = new renderData({
        title : 'Moreii Wine',
        jsfile: 'wine_test.js'
    });
    res.render('wine/test',data);
});

module.exports = router;
