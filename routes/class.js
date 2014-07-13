var express = require('express'),
    config = require('../core/config'),
    userSchema = require('../core/schema/user'),
    classSchema = require('../core/schema/class'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii';
    this.cssfile=data.cssfile || 'datepicker3.css,class.css';
    this.jsfile = data.jsfile || 'bootstrap-datepicker.js,locales/bootstrap-datepicker.zh-CN.js,class.js';
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
//控制台首页
router.get('/console',function(req,res){
    var data = new renderData({
        title:'class console index'
    });
    res.render('class/console/index',data);
});
//编辑课程
router.get('/console/edit',function(req,res){
    var data = new renderData({
        title:'class console edit'
    });
    res.render('class/console/edit',data);
});
//添加课程api
router.post('/api/addClass',function(req,res){
    var classData = req.body.classData;
    if(!/^\t*$/.test(classData.name) && !/^\t*$/.test(classData.intro)){//检测课程名称和简介是否为空
        if(/^[0-9]+年[0-9]+月[0-9]+日$/.test(classData.startTime) && /^[0-9]+年[0-9]+月[0-9]+日$/.test(classData.endTime)){//检测起止日期格式
            classData.startTime = new Date(classData.startTime.split(/[\u4e00-\u9fa5]/).join('/'));
            classData.endTime = new Date(classData.endTime.split(/[\u4e00-\u9fa5]/).join('/'));
            classData.studentsCount = 0;
            classData.createTime = new Date();
            classSchema.add(classData,function(err,classDataSaved){
                if(err===null){
                    res.send(JSON.stringify({
                        err:false,
                        des:'添加课程成功！'
                    }))
                }else{
                    res.send(JSON.stringify({
                        err:true,
                        des:'数据错误，添加课程失败。'
                    }));
                }
            });
        }else{
            res.send(JSON.stringify({
                err:true,
                des:'起止日期格式出错，请检查。'
            }));
        }
    }else{
        res.send(JSON.stringify({
            err:true,
            des:'课程名称和简介不能为空。'
        }));
    }
});

module.exports = router;
