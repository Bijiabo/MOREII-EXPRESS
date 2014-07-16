var express = require('express'),
    config = require('../core/config'),
    router = express.Router(),
    userSchema = require('../core/schema/user');
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || '用户中心';
    this.jsfile = data.jsfile ||'ProvinceAndCityJson.js,user.js';
    this.siteUrl = config.siteUrl;
    this.app = 'user';
    this.pretty = true;
}
/* GET users listing. */
router.get('/', function(req, res) {
    var data = new renderData({
        title : '用户中心'
    });
    userSchema.checkLogin(req,res,function(login){
        if(login){
            res.render('user/index',data);
        }else{
            res.redirect('/user/login');
        }
    });

});
router.get('/register',function(req,res){
    var data = new renderData({
        title : '注册'
    });
    res.render('user/register',data);
});
router.get('/login',function(req,res){
    var data = new renderData({
        title : '登陆'
    });
    res.render('user/login', data);
});

/**
 * 已登陆用户功能-----------------------------------------------------------------------------------
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            config.resError(req,res,'请登录。',config.siteUrl+'user/login');
            /*if(req.query.ajax !== 'true'){
                res.redirect('/user/login');
            }else{
                config.resError(req,res,'请登录。');
            }*/
        }
    });
});
router.get('/logout',function(req,res){
    res.clearCookie('name', { path: '/' });
    res.clearCookie('mail', { path: '/' });
    res.clearCookie('mii_login', { path: '/' });
    var data = new renderData({
        title : '退出成功'
    });
    res.render('user/logout', data);
});
router.get('/account',function(req,res){
    var data = new renderData({
        title : '我的资料',
        jsfile:'ProvinceAndCityJson.js,user.js'
    });
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            data.userData = userData;
            data.userData.password = undefined;
            res.render('user/account', data);
        }else{
            data.title = '500 Error';
            data.errorname = '500';
            res.render('500', data);
        }
    });
});
router.post('/api/addAddress',function(req,res){
    var addressData = new userSchema.addressSchema({
        province:req.body.province,
        areaType:req.body.areaType,
        area:req.body.area,
        address:req.body.address,
        name:req.body.name,
        tel:req.body.tel
    });
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var userId = userData._id;
            userSchema.addAddress(userId,addressData,function(err,data){
                res.send(JSON.stringify({
                    err:err
                }));
            });
        }else{
            data.title = '500 Error';
            data.errorname = '500';
            res.render('500', data);
        }
    });
});
router.post('/api/deleteAddress',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var userId = userData._id;
            userSchema.deleteAddress(userId,req.body.addressIndex,function(err,data){
                res.send(JSON.stringify({
                    err:err
                }));
            });
        }else{
            data.title = '500 Error';
            data.errorname = '500';
            res.render('500', data);
        }
    });
});
router.post('/api/modifyAddress',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var userId = userData._id;
            userSchema.modifyAddress(userId,{addressIndex:req.body.addressIndex,addressData:req.body.addressData},function(err,data){
                res.send(JSON.stringify({
                    err:err
                }));
            });
        }else{
            data.title = '500 Error';
            data.errorname = '500';
            res.render('500', data);
        }
    });
});
router.get('/api/getOwnInfo',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var data = {
                err:err,
                data:userData
            }
            data.data.password = undefined;
            res.send(JSON.stringify(data));
        }else{
            data.title = '500 Error';
            data.errorname = '500';
            res.render('500', data);
        }
    });
});

/**
 * user admin---------------------------------------------------------------------------------------
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
// console
router.get('/console',function(req,res){
    userSchema.getUserList({},0,10,function(err,userData){
        if(!err){
            var data = new renderData({
                jsfile:'user_console.js'
            });
            data.userData = userData;
            res.render('user/console/index',data);
        }else{
            res.render('505',{
                title:'505',
                path:'/blog'+req.path,
                errorname:'505'
            });
        }
    });
});
router.get('/api/getUserInfo/:id',function(req,res){
    userSchema.getUserInfoById(String(req.params.id),function(err,userData){
        if(!err && userData!==null){
            var data = userData;
            data.password = undefined;
            res.json(data);
        }else{
            res.json({err:true});
        }
    });
});
router.get('/api/getUserPermission/:id',function(req,res){
    userSchema.getUserInfoById(String(req.params.id),function(err,userData){
        if(!err && userData!==null){
            var data = userData.permission;
            res.send(JSON.stringify(data));
        }else{
            res.send(JSON.stringify({
                err:true
            }));
        }
    });
});
router.post('/api/editUser/:id',function(req,res){
    userSchema.editUserById(req.params.id,req.body.userData,function(err){
        if(err!==null){
            res.send(JSON.stringify({
                err:false
            }));
        }else{
            res.send(JSON.stringify({
                err:true
            }));
        }
    })
})

module.exports = router;