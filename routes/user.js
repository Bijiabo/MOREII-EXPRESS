var express = require('express'),
    config = require('../core/config'),
    router = express.Router(),
    userSchema = require('../core/schema/user');
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || '用户中心';
    this.jsfile = data.jsfile ||'user.js';
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
 * 已登陆用户功能
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            res.redirect('/user/login');
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
 * administrator
 * api
 * */
router.use(function(req,res,next){
    userSchema.isAdmin(req,function(admin){
        if(admin){
            next();
        }else{
            res.render('404',{
                title:'404错误',
                path:'/blog'+req.path,
                errorname:'404'
            });
        }
    });
});
router.get('/console',function(req,res){
    var data = new renderData();
    res.render('user/console/index',data);
});


module.exports = router;