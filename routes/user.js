var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy;
//router.use(passport.initialize());
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
router.use(passport.initialize());
passport.use(new GitHubStrategy({
        clientID: 'd7ae84d6f28449287145',
        clientSecret: '0bc7b83eacca9446fb97a6cd2ae16bd27c59f880',
        callbackURL: global.config.siteUrl+"user/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));
var renderData = function(data){
    if(data===undefined){
        data = {};
    }
    this.title = data.title || '用户中心';
    this.jsfile = data.jsfile ||'ProvinceAndCityJson.js,user.js';
    this.cssfile = data.cssfile || '';
    this.siteUrl = global.config.siteUrl;
    this.app = 'user';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.logo = global.config.logo;
    this.consoleNav = [
        {
            name:'用户列表',
            path:''
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.pretty = true;
}
//验证后台页面权限接口
router.get('/api/consolePermission',function(req,res){
    global.config.checkPermission(req,res,'user','editUser',false,function(hasPermission){
        if(hasPermission){
            res.json({
                permission:true
            });
        }else{
            res.json({
                permission:false
            });
        }
    });
});
/* GET users listing. */
router.get('/', function(req, res) {
    var data = new renderData({
        title : '用户中心'
    });
    if(req.login){
        res.render('user/index',data);
    }else{
        res.redirect('/user/login');
    }
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
    if(req.login){
        res.redirect('/user');
    }else{
        res.render('user/login', data);
    }
});
//github
router.get('/auth/github',passport.authenticate('github',{ session : false}));
router.get('/auth/github/callback',
    passport.authenticate('github', {
        session:false,
        failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);
/**
 * 已登陆用户功能-----------------------------------------------------------------------------------
 * */
router.use(function(req,res,next){
    if(req.login){
        next();
    }else{
        global.config.resError(req,res,'请登录。',global.config.siteUrl+'user/login');
    }
});
router.get('/logout',function(req,res){
    req.session.user=null;
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
    data.userData = req.userData;
    data.userData.password = undefined;
    res.render('user/account', data);
});
router.post('/api/addAddress',function(req,res){
    var addressData = {
        province:req.body.province,
        areaType:req.body.areaType,
        area:req.body.area,
        address:req.body.address,
        name:req.body.name,
        tel:req.body.tel
    };
    global.userSchema.addAddress(req.userData._id,addressData,function(err,data){
        res.send(JSON.stringify({
            err:err
        }));
    });
    /*global.userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var userId = userData._id;
            global.userSchema.addAddress(userId,addressData,function(err,data){
                res.send(JSON.stringify({
                    err:err
                }));
            });
        }else{
            data.title = '500 Error';
            data.errorname = '500';
            res.render('500', data);
        }
    });*/
});
router.post('/api/deleteAddress',function(req,res){
    global.userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var userId = userData._id;
            global.userSchema.deleteAddress(userId,req.body.addressIndex,function(err,data){
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
    global.userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var userId = userData._id;
            global.userSchema.modifyAddress(userId,{addressIndex:req.body.addressIndex,addressData:req.body.addressData},function(err,data){
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
    global.userSchema.getUserInfo({
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
    if(req.userData.permission.user.editUser){
        next();
    }else{
        global.config.resError(req,res,'权限不足。');
    }
    /*global.userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            if(userData.permission.user.editUser){//拥有修改用户的权限
                next();
            }else{//无修改用户的权限
                global.config.resError(req,res,'权限不足。');
            }
        }else{
            global.config.resError(req,res,'数据错误。');
        }
    });*/
});
// console
router.get('/console',function(req,res){
    global.userSchema.getUserList({},0,10,function(err,userData){
        if(!err){
            var data = new renderData({
                title:'用户管理',
                jsfile:'user_console.js',
                cssfile:'user_console.css'
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
    global.userSchema.getUserInfoById(String(req.params.id),function(err,userData){
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
    global.userSchema.getUserInfoById(String(req.params.id),function(err,userData){
        if(!err && userData!==null){
            var data = userData.permission;
            for(key in global.config.app){
                if(global.config.app[key].state===0){
                    data[key] = undefined;
                }
            }
            res.send(JSON.stringify(data));
        }else{
            res.send(JSON.stringify({
                err:true
            }));
        }
    });
});
router.post('/api/editUser/:id',function(req,res){
    global.userSchema.editUserById(req.params.id,req.body.userData,function(err){
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