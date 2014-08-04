var express = require('express'),
    config = require('../core/config'),
    fs = require('fs'),
    path=require('path'),
    userSchema = require('../core/schema/user');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii mobile';
    this.cssfile = data.cssfile || 'mobile.css';
    this.jsfile = data.jsfile ||'mobile.js';
    this.siteUrl = config.siteUrl;
    this.app = 'mobile';
    this.nav = config.nav;
    this.apps = config.app;
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    console.log(router.stack);
    var data = new renderData({
        title : 'Moreii mobile'
    });
    res.render('mobile/index', data);
});

module.exports = router;
