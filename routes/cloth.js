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
router.route('/detail/:id')
    .get(function(req, res,next) {
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
    })
    .post(function(req,res,next){
        clothSchema.getDetail(global.xss.text.process(req.params.id),function(err,clothData){
            if(err===null){
                res.json({
                    err:false,
                    data:clothData
                });
            }else{
                res.json({
                    err:true,
                    des:'数据错误。'
                });
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
* 后台面料列表
* */
router.get('/console/list', function(req, res) {
    var page = 0,
        limitPerPage = 12;
    if(!isNaN(Number(req.query.page))){
        page = Number(req.query.page) - 1;
    }
    var data = new renderData({
        title : 'Moreii cloth list',
        consoleNavActive:'list',
        jsfile:'cloth_console.js'
    });
    clothSchema.find({state:1},{"_id":-1},limitPerPage*page,limitPerPage,function(err,clothData){
        if(err===null){
            data.clothData=clothData;
            clothSchema.getFindCount({state:1},function(err1,countData){
                if(err1===null){
                    data.pageUrl = global.config.siteUrl + data.app + '/console/list/?page=';
                    data.pageCount = Math.ceil(countData / limitPerPage);
                    data.pageNow = page + 1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('cloth/console/list', data);
                }else {
                    res.redirect(global.config.siteUrl + '500');
                }
            });
        }else{
            global.config.resError(req,res,'500');
        }
    });
});
//编辑面料
router.route('/console/edit/:id')
    .get(function(req,res,next){
        var data = new renderData({
            title : '编辑面料 --'+global.config.siteName,
            consoleNavActive:'edit',
            jsfile:'cloth_console.js'
        });
        clothSchema.getDetail(global.xss.text.process(req.params.id),function(err,clothData){
            console.log(err===null && clothData!==undefined);
            if(err===null && clothData!==undefined){
                data.clothData = clothData;
                res.render('cloth/console/edit',data);
            }else{
                res.redirect(global.config.siteUrl+'500');
            }
        });
    })
    .post(function(req,res,next){
        var clothData = req.body.addClothInfo;
        //过滤数据
        clothData.uid = req.userData._id.toString();
        clothData.uname = req.userData.name;
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
        clothSchema.update(global.xss.text.process(req.params.id),clothData,function(err){
            console.log(err);
            if(err===null){
                res.json({
                    err:false
                });
            }else{
                res.json({
                    err:true,
                    des:'数据错误，请重试。'
                });
            }
        })
    });
//添加面料页面
router.get('/console/add', function(req, res) {
    var data = new renderData({
        title : '添加面料 --'+global.config.siteName,
        consoleNavActive:'add',
        jsfile:'cloth_console.js'
    });
    res.render('cloth/console/add', data);
});
//添加面料api
router.post('/api/add',function(req,res){
    var clothData = req.body.addClothInfo;
    //过滤数据
    clothData.uid = req.userData._id.toString();
    clothData.uname = req.userData.name;
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
//                clothData.picture[i] = global.xss.text.process(clothData.picture[i]);
            }
        }
    }else{
        clothData.picture = [];
    }
    clothSchema.add(clothData,function(err,data){
        if(err===null){
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
//删除面料api
router.post('/api/delete',function(req,res){
    var idArray = req.body.idArray;
    if(idArray.constructor.toString().match('Array')!==null){
        if(idArray.length>0){
            clothSchema.delete(idArray,function(err){
                console.log(err);
                if(err===null){
                    res.json({
                        err:false
                    });
                }else{
                    res.json({
                        err:true,
                        des:'删除失败，请重试。'
                    });
                }
            });
        }else{
            res.json({
                err:true,
                des:'数据错误,请选择要删除的对象 。'
            });
        }
    }else{
        res.json({
            err:true,
            des:'数据错误，请刷新后重试。'
        });
    }
});
//关于页面
router.get('/console/about', function(req, res) {
    var data = new renderData({
        title : '关于面料模块 --'+global.config.siteName,
        consoleNavActive:'about',
        jsfile:'cloth_console.js'
    });
    res.render('cloth/console/about', data);
});

module.exports = router;
