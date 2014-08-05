/**
 * Created by bijiabo on 14-7-20.
 */
var express = require('express'),
    ua_Parser_js = require('ua-parser-js'),
    userSchema =  require('../core/schema/user'),
    statisticsSchema = require('../core/schema/statistics');
var router = express.Router();
var UAparser = new ua_Parser_js();

var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || '统计中心';
    this.cssfile = data.cssfile || '';
    this.jsfile = data.jsfile ||'';
    this.siteUrl = global.config.siteUrl;
    this.app = 'statistics';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
};

router.get('/', function(req, res) {
    var data = new renderData();
    res.render('index', data);
});

/**
 * api
 * */
router.post('/api/submit',function(req,res){
    UAparser.setUA(req.headers['user-agent']);
    var ua = UAparser.getResult();
    var data = req.body.data;
    data.ip = req._remoteAddress;
    data.ua = ua.ua;
    data.browser = ua.browser;
    data.engine = ua.engine;
    data.os = ua.os;
    data.device = ua.device;
    data.cpu = ua.cpu;
    userSchema.checkLogin(req,res,function(login){
        if(login){
            userSchema.getUserInfo({
                name:req.cookies.name,
                mail:req.cookies.mail
            },function(err,userData){
                if(err===null && userData!==null){
                    data.uid = userData._id.toString();
                    data.uname = userData.name;
                    statisticsSchema.add(data,function(err,savedData){
                        if(err===null){
                            res.json({
                                err:false,
                                id:savedData._id.toString()
                            });
                        }else{
                            res.json({
                                err:true,
                                des:'数据保存错误.'
                            });
                        }
                    });
                }else{
                    res.json({
                        err:true,
                        des:'用户身份信息错误.'
                    });
                }
            });
        }else{
            //未登陆用户
            statisticsSchema.add(data,function(err,savedData){
                if(err===null){
                    res.json({
                        err:false,
                        id:savedData._id.toString()
                    });
                }else{
                    res.json({
                        err:true,
                        des:'数据保存错误.'
                    });
                }
            });
        }
    });
});
/**
 * 更新页面打开后的浏览时间
 * */
/*
router.post('/api/updateOpenTime',function(req,res){
    if(/^\w+$/.test(req.body.id) && !isNaN(Number(req.body.time))){
        console.log(req.body.time);
        console.log('----------------------------------------------------');
        statisticsSchema.updateOpenTime(req.body.id,Number(req.body.time),function(err,data){
            if(err===null){
                res.json({
                    err:false
                });
            }else{
                res.json({
                    err:true,
                    des:'数据保存错误.'
                });
            }
        });
    }else{
        res.json({
            err:true,
            des:'id传输错误'
        });
    }
});
*/
/**
 * 检测用户登录
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            global.config.resError(req,res,'请登录。',global.config.siteUrl+'user/login');
        }
    });
});

/**
 * 检测统计后台基础查看权限 -view
 * */
router.use(function(req,res,next){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            if(userData.permission.statistics.view){//拥有权限
                next();
            }else{//无权限
                global.config.resError(req,res,'权限不足。');
            }
        }else{
            global.config.resError(req,res,'数据错误。');
        }
    });
});

/**
 * 后台统计查看
 * */

router.get('/console', function(req, res) {
    var data = new renderData({
        jsfile:'statistics_console.js'
    });
    data.data = {};
    statisticsSchema.todayViewCount(function(err,todayViewCount){
        if(err===null){
            data.data.todayViewCount = todayViewCount;
        }else{
            data.data.todayViewCount = 0;
        }
        res.render('statistics/console/index', data);
    });
});

router.get('/api/perLoadingTime',function(req,res){
    statisticsSchema.getPerLoadingTime(function(err,data){
        if(err===null){
            res.json({
                err:false,
                data:data
            });
        }else{
            res.json({
                err:true,
                des:'数据获取错误.'
            });
        }
    });
});

module.exports = router;
