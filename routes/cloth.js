var express = require('express'),
    fs = require('fs'),
    path=require('path'),
    userSchema = require('../core/schema/user');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii cloth';
    this.cssfile = data.cssfile || 'cloth.css';
    this.jsfile = data.jsfile ||'cloth.js';
    this.siteUrl = global.config.siteUrl;
    this.app = 'cloth';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.consoleNav = [
        {
            name:'管理',
            path:''
        },
        {
            name:'面料列表',
            path:'list'
        },
        {
            name:'添加面料',
            path:'add'
        },
        {
            name:'关于',
            path:'about'
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth'
    });
    res.render('cloth/index', data);
});

/*
* 后台编辑面料
* */
router.get('/console/list', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth list',
        consoleNavActive:'list'
    });
    res.render('cloth/console/list', data);
});
router.get('/console/add', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth add',
        consoleNavActive:'add'
    });
    res.render('cloth/console/add', data);
});
router.get('/console/about', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth about',
        consoleNavActive:'about'
    });
    res.render('cloth/console/about', data);
});

module.exports = router;
