var express = require('express'),
    fs = require('fs'),
    path=require('path'),
    userSchema = require('../core/schema/user'),
    clothSchema = require('../core/schema/cloth');
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
/*
 * 前台页面
 * */
router.get('/', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth'
    });
    res.render('cloth/index', data);
});
/*
* 验证后台权限
* */
router.use(function(req,res,next){
    global.config.checkPermission(req,res,'cloth','edit',true,function(hasPermission){
        if(hasPermission){
            next();
        }
    })
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
//添加面料页面
router.get('/console/add', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth add',
        consoleNavActive:'add'
    });
    res.render('cloth/console/add', data);
});
//添加面料api
router.post('/api/add',function(req,res){
    var clothData = req.body.addClothInfo;
    console.log(clothData);
    //过滤数据
    clothData.codeNumber = global.xss.text.process(clothData.codeNumber);
    clothData.brand = global.xss.text.process(clothData.brand);
    clothData.originPlace = global.xss.text.process(clothData.originPlace);
    clothData.color = global.xss.text.process(clothData.color);
    clothData.pattern = global.xss.text.process(clothData.pattern);
    clothData.weight = Number(global.xss.text.process(clothData.weight));
    clothData.price = Number(global.xss.text.process(clothData.price));
    clothData.yarnCount = Number(global.xss.text.process(clothData.yarnCount));
    clothData.description = global.xss.html.process(clothData.description);
    if(clothData.picture===undefined){clothData.picture=[];}
    if(clothData.picture.constructor.toString().match('Array')!==null){
        if(clothData.picture.length>0){
            for(var i= 0,len=clothData.picture.length;i<len;i++){
                clothData.picture[i] = global.xss.text.process(clothData.picture[i]);
            }
        }
    }else{
        clothData.picture = [];
    }
    clothSchema.add(clothData,function(err,data){
        if(err===null){
            console.log('===========');
            res.json({
                err:false,
                des:'添加成功'
            });
        }else{
            res.json({
                err:true,
                des:'添加失败，请重试。'
            });
        }
    })
});
//关于页面
router.get('/console/about', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth about',
        consoleNavActive:'about'
    });
    res.render('cloth/console/about', data);
});

module.exports = router;
