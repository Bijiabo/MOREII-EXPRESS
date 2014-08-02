/**
 * Created by boooo on 14-8-2.
 */
var express = require('express'),
    router = express.Router(),
    config = require('../core/config'),
    userSchema = require('../core/schema/user'),
    noticeSchema = require('../core/schema/notice'),
    siteSchema = require('../core/schema/site'),
    os = require('os'),
    crypto = require('crypto');
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii Console';
    this.jsfile = data.jsfile ||'console_console.js';
    this.cssfile = data.cssfile || '';
    this.siteUrl = config.siteUrl;
    this.data = data.data || {};
    this.app = 'console';
    this.apps = config.app;
    this.consoleNav = [
        {
            name:'基本信息',
            path:''
        },
        {
            name:'更新缓存',
            path:'cache'
        },
        {
            name:'全局导航',
            path:'nav'
        },
        {
            name:'关于',
            path:'about'
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.pretty = true;
};
/*
* 基本信息设置页面
* */
router.get('/console', function(req, res) {
    var data = new renderData({
        title:'站点基本信息设置',
        consoleNavActive:''
    });
    siteSchema.getLatestInfo(function(err,siteData){
        if(err===null && siteData!==null){
            data.siteData = siteData;
            res.render('console/index',data);
        }else{
            res.redirect(config.siteUrl+'500');
        }
    });
});
/*
* 缓存刷新页面
* */
router.get('/console/cache', function(req, res) {
    var data = new renderData({
        title:'更新缓存',
        consoleNavActive:'cache'
    });
    siteSchema.refreshSiteConfigure(function(err,queryData){
        data.refreshCacheErr = err;
        res.render('console/cache',data);
    });
});
/*
* 修改站点信息api
* */
router.post('/api/modifySiteInfo',function(req,res){
    var siteData = req.body.data;
    for(var i= 0,len=siteData.app.length;i<len;i++){
        siteData.app[i].state = Number(siteData.app[i].state);
    }
    if(siteData!==undefined && typeof siteData === 'object'){
        siteSchema.update(siteData,function(err,savedData){
            if(err===null){
                res.json({
                    err:false,
                    des:'保存成功。'
                });
            }else{
                res.json({
                    err:true,
                    des:'数据错误。'
                });
            }
        });
    }
});
/*
* 关于页面
* */
router.get('/console/about', function(req, res) {
    var data = new renderData({
        title:'关于站点',
        consoleNavActive:'about',
        data:{
            cpus:os.cpus(),
            osType:os.type(),
            platform:os.platform(),
            arch:os.arch(),
            version:config.version
        }

    });
    res.render('console/about',data);
});
router.get('/console/nav', function(req, res) {
    var data = new renderData({
        title:'关于站点',
        consoleNavActive:'nav',
        data:{
            cpus:os.cpus(),
            osType:os.type(),
            platform:os.platform(),
            arch:os.arch(),
            version:config.version
        }

    });
    res.render('console/about',data);
});
module.exports = router;