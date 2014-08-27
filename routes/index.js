var express = require('express'),
    indexSchema = require('../core/schema/index'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || global.config.siteName;
    this.jsfile = data.jsfile || '';
    this.cssfile = data.cssfile || 'index.css';
    this.app = 'index';
    this.consoleNav = [
        {
            name:'内容设置',
            path:''
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
}
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
    console.log(req.login);
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
//后台首页
router.get('/console/', function(req, res) {
    var data = new renderData({
        jsfile:'index_console.js',
        cssfile:'index_console.css'
    });
    res.render('index/console/index', data);
});
/*
* 后台api
* */
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



/*
* 路由测试功能
* */
/*router.get('/stack', function(req, res) {
    console.log(router.stack);
    res.json({
        stack : router.stack
    });
});
router.get('/reset', function (req, res) {
    var router_stack = router.stack.concat([]);
    router.stack.length = 0;
    router_stack.forEach(function (item) {
        if (item.route.path !== '/') {
            router.stack.push(item);
        }
    });
    res.json({
        stack : router.stack
    });
});*/

module.exports = router;
