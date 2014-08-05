/**
 * Created by boooo on 14-6-1.
 */
var express = require('express'),
    router = express.Router(),
    userSchema = require('../core/schema/user'),
    noticeSchema = require('../core/schema/notice'),
    crypto = require('crypto');
/**
 * basic func
 * */
var dataToLowerCase = function(obj){
    for(i in obj){
        if(typeof obj[i] === 'string'){
            obj[i] = obj[i].toLowerCase();
        }
    }
    return obj;
}
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii Blog';
    this.jsfile = data.jsfile ||'console.js';
    this.cssfile = data.cssfile || 'console.css';
    this.siteUrl = global.config.siteUrl;
    this.blogData = data.blogData ||{title:'',content:'',tag:[],_id:''};
    this.app = 'console';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
}

router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
       if(login){
           userSchema.getUserInfo({
               name:req.cookies.name,
               mail:req.cookies.mail
           },function(err,userData){
                if(err===null && userData!==null){
                    if(userData.permission.shop.editGood){
                        next();
                    }else{
                        res.render('no_permission',{
                            title:'权限不足',
                            des:'您没有此页面浏览权限。'
                        });
                    }
                }else{
                    res.render('500',{
                        title:'数据错误',
                        des:'请检查您的登录状态，刷新页面后重试。'
                    });
                }
           });
       }else{
           res.render('no_permission',{
               title:'权限不足',
               des:'此页面仅登录用户可见。',
           });
       }
    });
});

router.get('/', function(req, res) {
    var data = new renderData({
        title:'控制台首页'
    });
    res.render('shop_console/index',data);
});
router.get('/addGood',function(req,res){
    var data = new renderData({
        title:'添加商品'
    });
    res.render('shop_console/addGood',data);
});
router.get('/uploadImage',function(req,res){
    var data = new renderData({
        title:'上传图片'
    });
    res.render('shop_console/uploadImage',data);
});

module.exports = router;