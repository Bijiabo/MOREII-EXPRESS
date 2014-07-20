var express = require('express'),
    config = require('../core/config'),
    fs = require('fs'),
    path=require('path'),
    userSchema = require('../core/schema/user'),
    noticeSchema = require('../core/schema/notice');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii mobile';
    this.cssfile = data.cssfile || 'mobile.css';
    this.jsfile = data.jsfile ||'mobile.js';
    this.siteUrl = config.siteUrl;
    this.app = 'notice';
    this.pretty = true;
}
/**
 * api for users
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            if(req.query.ajax === 'true'){
                res.json({
                    err:true,
                    des:'请登陆啊亲>_<'
                });
            }else{
                res.redirect('/user/login');
            }
        }
    });
});

router.get('/api/getUnread', function(req, res) {
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            noticeSchema.unreadNotice({uid:userData._id.toString()},function(err,data){
                if(err===null){
                    res.json({
                        err:false,
                        data:data
                    });
                }else{
                    res.json({
                        err:true,
                        des:'数据获取错误。'
                    });
                }
            });
        }else{
            res.json({
                err:true,
                des:'用户数据错误。'
            });
        }
    });
});

module.exports = router;
