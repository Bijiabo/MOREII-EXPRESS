/**
 * Created by boooo on 14-8-2.
 */
var express = require('express'),
    router = express.Router(),
    userSchema = require('../core/schema/user'),
    noticeSchema = require('../core/schema/notice'),
    siteSchema = require('../core/schema/site'),
    os = require('os'),
    crypto = require('crypto');
var renderData = function(data){
    if(data===undefined){
        data = {};
    }
    this.title = data.title || 'Moreii Console';
    this.jsfile = data.jsfile ||'console_console.js';
    this.cssfile = data.cssfile || 'console.css';
    this.siteUrl = global.config.siteUrl;
    this.data = data.data || {};
    this.nav = global.config.nav;
    this.app = 'console';
    this.apps = global.config.app;
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
//判断权限
router.use(function(req,res,next){
    global.config.checkPermission(req,res,'console','edit',true,function(hasPermission){
        if(hasPermission){
            next();
        }
    });
});
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
            res.redirect(global.config.siteUrl+'500');
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
    for(var item in siteData.app){
        siteData.app[item].state = Number(siteData.app[item].state);
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
            version:global.config.version
        }

    });
    res.render('console/about',data);
});
/*
* 导航设置页面
* */
router.get('/console/nav', function(req, res) {
    var data = new renderData({
        title:'关于站点',
        consoleNavActive:'nav',
        data:{
            logo:global.config.logo
        }
    });
    res.render('console/nav',data);
});
router.post('/api/updateNav',function(req,res){
    var navArray = req.body.navArray;
    if(navArray.constructor.toString().match('Array')!==null){
        siteSchema.updateNav(navArray,function(err,savedData){
            if(err===null){
                siteSchema.refreshSiteConfigure(function(err1){
                    if(err1===null){
                        res.json({
                            err:false,
                            des:'导航更新成功。'
                        });
                    }else{
                        res.json({
                            err:true,
                            des:'缓存刷新错误。'
                        });
                    }
                });
            }else{
                res.json({
                    err:true,
                    des:'数据错误。'
                });
            }
        });
    }else{
        res.json({
            err:true,
            des:'数据格式错误。'
        });
    }
});
/*
 * 回复初始设置
 * */
router.get('/api/recover0', function(req, res) {
    siteSchema.recoverFromConfig(function(err,queryData){
        res.json({
            err:err
        });
    });
});
module.exports = router;