/**
 * Created by boooo on 14-6-1.
 */
var express = require('express'),
    router = express.Router(),
    config = require('../core/config'),
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

var renderData = {
    title:'Console',
    jsfile:'console.js',
    siteUrl:config.siteUrl
}

router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
       if(login){
           userSchema.checkAdministratorPermission({
               name:req.cookies.name,
               mail:req.cookies.mail
           },function(err,data){
                if(err===null && data!==null){
                    next();
                }else{
                    res.render('404',{
                        title:'404错误',
                        path:'/console'+req.path,
                        errorname:'404'
                    });
                }
           });
       }else{
           res.render('404',{
               title:'404错误',
               path:'/console'+req.path,
               errorname:'404',
           });
       }
    });
});

router.get('/', function(req, res) {
    var data = renderData;
    data.title = '控制台首页';
    res.render('console/index',data);
});
router.get('/addGood',function(req,res){
    var data = renderData;
    data.title = '添加商品';
    res.render('console/addGood',data);
});
router.get('/uploadImage',function(req,res){
    var data = renderData;
    data.title = '上传图片';
    res.render('console/uploadImage',data);
});

module.exports = router;