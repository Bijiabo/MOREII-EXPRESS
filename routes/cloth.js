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
//列表页面
router.get('/', function(req, res) {
    var page = 0,
        limitPerPage = 12;
    if(!isNaN(Number(req.query.page))){
        page = Number(req.query.page) - 1;
    }
    var data = new renderData({
        title : 'Moreii cloth'
    });
    clothSchema.find({state:1},{"_id":-1},limitPerPage*page,limitPerPage,function(err,clothData){
        if(err===null){
            data.clothData=clothData;
            clothSchema.getFindCount({state:1},function(err1,countData){
                if(err1===null){
                    data.pageUrl = global.config.siteUrl + data.app + '/?page=';
                    data.pageCount = Math.ceil(countData / limitPerPage);
                    data.pageNow = page + 1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    console.log(countData)
                    res.render('cloth/index', data);
                }else {
                    res.redirect(global.config.siteUrl + '500');
                }
            });

        }else{
            global.config.resError(req,res,'500');
        }
    });
});
//详情页面
router.get('/detail/:id', function(req, res) {
    var data = new renderData({
        title : 'Moreii cloth'
    });
    clothSchema.getDetail(global.xss.text.process(req.params.id),function(err,clothData){
        if(err===null){
            data.clothData=clothData;
            res.render('cloth/detail', data);
        }else{
            global.config.resError(req,res,'500');
        }
    });
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
    clothSchema.find({state:1},{"_id":-1},0,10,function(err,clothData){
        if(err===null){
            data.clothData=clothData;
            res.render('cloth/console/list', data);
        }else{
            global.config.resError(req,res,'500');
        }
    });
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
