var express = require('express'),
    indexSchema = require('../core/schema/index'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        data = {};
    }
    this.title = data.title || global.config.siteName;
    this.jsfile = data.jsfile || '';
    this.cssfile = data.cssfile || 'index.css';
    this.app = 'index';
    this.consoleNav = [
        {
            name:'图片设置',
            path:''
        },
        {
            name:'文字设置',
            path:'text'
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
};
//验证后台页面权限接口
router.get('/api/consolePermission',function(req,res){
    global.config.checkPermission(req,res,'index','edit',true,function(hasPermission){
        if(hasPermission){
            res.json({
                permission:true
            });
        }else{
            res.json({
                permission:false
            });
        }
    });
});
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData();
    indexSchema.getUseOne(function(err,indexData){
        if(err===null){
            data.data=indexData;
            res.render('index/index', data);
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});
app.get('/500',function(req,res){
    res.status(500);
    var data = new renderData({
        title:'500'
    });
    res.render('500',data);
});
/*
* 后台
* */
router.use('/console/?*', function(req,res,next){
    if(req.login){
        global.config.checkPermission(req,res,'index','edit',true,function(hasPermission){
            if(hasPermission){
                next();
            }
        });
    }else{
        res.redirect(global.config.siteUrl+'user/login');
    }
});
//后台首页 更改图片
router.get('/console', function(req, res) {
    var data = new renderData({
        jsfile:'index_console.js',
        cssfile:'index_console.css'
    });
    indexSchema.getUseOne(function(err,indexData){
        console.log(indexData);
        if(err===null){
            data.data=indexData;
            res.render('index/console/index', data);
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});
//后台 编辑首页文字
router.get('/console/text', function(req, res) {
    var data = new renderData({
        jsfile:'index_console.js',
        cssfile:'index_console.css',
        consoleNavActive:'text'
    });
    indexSchema.getUseOne(function(err,indexData){
        if(err===null){
            data.data=indexData;
            res.render('index/console/text', data);
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});
/*
* 后台api
* */
//更新首页内容
router.post('/console/api/updateIndex/:id?',function(req,res){
    if(req.params.id===undefined){
        //新建首页模板
        indexSchema.add(req.body.indexData,function(err){
            if(err===null){
                res.json({
                    err:false,
                    des:"新建首页模板成功!"
                });
            }else{
                res.json({
                    err:true,
                    des:"新建首页模板失败，请重试。"
                });
            }
        });
    }else{
        //修改首页模板
        if(/^\w+$/.test(req.params.id)){
            indexSchema.update(req.params.id,req.body.indexData,function(err){
                if(err===null){
                    res.json({
                        err:false,
                        des:"修改首页模板成功!"
                    });
                }else{
                    res.json({
                        err:true,
                        des:"修改首页模板失败，请重试。"
                    });
                }
            });
        }else{
            res.json({
                err:true,
                des:"数据错误，请刷新页面后重试。"
            });
        }
    }
});
module.exports = router;
