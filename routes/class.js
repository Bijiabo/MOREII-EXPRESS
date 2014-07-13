var express = require('express'),
    config = require('../core/config'),
    userSchema = require('../core/schema/user'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii';
    this.jsfile = data.jsfile || '';
    this.siteUrl = config.siteUrl;
    this.app = 'class';
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData();
    res.render('class/index', data);
});

/**
 * 已登陆用户功能--------------------------------------------------------------------------------
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            config.resError(req,res,'请登录。',config.siteUrl+'user/login');
        }
    });
});

/**
 * user admin----------------------------------------------------------------------------------
 * api
 * */
router.use(function(req,res,next){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            if(userData.permission.user.editUser){//拥有修改用户的权限
                next();
            }else{//无修改用户的权限
                config.resError(req,res,'权限不足。');
            }
        }else{
            config.resError(req,res,'数据错误。');
        }
    });
});
router.get('/console',function(req,res){
    var data = new renderData({
        title:'class console index'
    });
    res.render('class/console/index',data);
});

module.exports = router;
