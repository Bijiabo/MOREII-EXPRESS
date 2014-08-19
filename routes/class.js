var express = require('express'),
    userSchema = require('../core/schema/user'),
    classSchema = require('../core/schema/class'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii';
    this.cssfile=data.cssfile || 'datepicker3.css,class.css';
    this.jsfile = data.jsfile || 'class.js';
    this.siteUrl = global.config.siteUrl;
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.app = 'class';
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    classSchema.list({},0,20,function(err,classData){
        if(err===null){
            var data = new renderData();
            data.data = classData;
            res.render('class/index', data);
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});

/**
 * 已登陆用户功能--------------------------------------------------------------------------------
 * */
router.use(function(req,res,next){
    if(req.login){
        next();
    }else{
        global.config.resError(req,res,'请登录。',global.config.siteUrl+'user/login');
    }
});

/**
 * user admin----------------------------------------------------------------------------------
 * api
 * */
router.use(function(req,res,next){
    if(req.userData.permission.class.editClass && req.userData.permission.class.editStudent && req.userData.permission.class.editTeacher){//拥有修改用户的权限
        next();
    }else{//无修改用户的权限
        global.config.resError(req,res,'权限不足。');
    }
});
//控制台首页
router.get('/console',function(req,res){
    classSchema.list({},0,20,function(err,classData){
        if(err===null){
            var data = new renderData({
                title:'class console index'
            });
            data.data = classData;
            res.render('class/console/index',data);
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});
//编辑课程
router.get('/console/edit',function(req,res){
    classSchema.list({},0,20,function(err,classData){
        if(err===null){
            var data = new renderData({
                title:'class console edit'
            });
            data.data = classData;
            res.render('class/console/edit',data);
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
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
                        des:'添加课程成功！',
                        classId:classDataSaved._id
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
//获取课程详细信息
router.get('/api/getClassInfoById/:id',function(req,res){
    classSchema.getClassInfoById(req.params.id,function(err,classData){
        if(err===null && classData!==null){
            res.send(JSON.stringify({
                err:false,
                data:classData
            }));
        }else{
            res.send(JSON.stringify({
                err:true,
                des:'数据错误。'
            }));
        }
    });
});
//修改课程信息
router.post('/api/modifyClass/:id',function(req,res){
    var classData = req.body.classData;
    for(var key in classData){
        classData[key] = global.config.securityFilter(classData[key]);
    }
    if(/^[0-9]+年[0-9]+月[0-9]+日$/.test(classData.startTime) && /^[0-9]+年[0-9]+月[0-9]+日$/.test(classData.endTime)){//检测起止日期格式
        classData.startTime = new Date(classData.startTime.split(/[\u4e00-\u9fa5]/).join('/'));
        classData.endTime = new Date(classData.endTime.split(/[\u4e00-\u9fa5]/).join('/'));
        classSchema.modifyById(req.params.id,classData,function(err,savedDate){
            if(err===null){
                res.send(JSON.stringify({
                    err:false,
                    des:'修改课程信息成功。'
                }));
            }else{
                res.send(JSON.stringify({
                    err:err,
                    des:'修改课程信息失败，请重试。'
                }));
            }
        });
    }else{
        res.send(JSON.stringify({
            err:true,
            des:'起止日期格式出错，请检查。'
        }));
    }
});
//编辑学生成员
router.get('/console/student',function(req,res){
    classSchema.listStudents({},0,20,function(err,studentsData){
        if(err===null){
            userSchema.getUserList({},0,20,function(userErr,userData){
                if(userErr===null){
                    var data = new renderData({
                        title:'class console students'
                    });
                    data.studentsData = studentsData;
                    data.userData = userData;
                    var uidArray = [];
                    for(var i=0;i<userData.length;i++){
                        uidArray.push(userData[i]._id);
                        userData[i].password=undefined;
                    }
                    classSchema.listStudents(uidArray,0,uidArray.length,function(usErr,userStudentData){
                        console.log(userStudentData);
                        if(usErr===null){
                            data.userStudentData = userStudentData;
                            res.render('class/console/student',data);
                        }else{
                            res.redirect(global.config.siteUrl+'500');
                        }
                    });
                }else{
                    res.redirect(global.config.siteUrl+'500');
                }
            });
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});
//添加用户的学生权限
router.post('/api/addUserToStudent',function(req,res){
    classSchema.addUserToStudent(req.body.userIdArray,function(err,savedData){
        if(err===null){
            res.json({
                err:false,
                des:'添加学生成功！'
            })
        }else{
            res.json({err:err});
        }
    });
});
//移除用户的学生权限
router.post('/api/removeUserToStudent',function(req,res){
    classSchema.removeUserToStudent(req.body.userIdArray,function(err,savedData){
        if(err===null){
            res.json({
                err:false,
                des:'移除学生权限成功！'
            })
        }else{
            res.json({err:err});
        }
    });
});
//搜索用户
router.get('/api/getUserInfo/:id',function(req,res){
    userSchema.getUserInfoById(String(req.params.id),function(err,userData){
        if(!err && userData!==null){
            var data = {
                _id:userData._id,
                name:userData.name
            };
            res.json({err:false,data:data});
        }else{
            res.json({err:true});
        }
    });
});
//获取教师列表
router.get('/api/getTeacherList/:name?/:page?',function(req,res){
    if(req.params.name){
        var find = {name:req.params.name};
    }else{
        var find = {};
    }
    console.log(find);
    classSchema.findTeacher(find,0,1,function(err,data){
        console.log(err);
        if(err===null){
            res.json({
                err:false,
                data:data
            });
        }else{
            res.json({
                err:true
            })
        }
    });
});
module.exports = router;
