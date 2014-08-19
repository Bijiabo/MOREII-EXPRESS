/**
 * Created by boooo on 14-5-17.
 */
var express = require('express'),
    router = express.Router(),
    userSchema = require('../core/schema/user'),
    noticeSchema = require('../core/schema/notice'),
    shopSchema = require('../core/schema/shop'),
    fs=require('fs'),
    util = require('util'),
    path=require('path'),
    crypto = require('crypto');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
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

var checkAdministratorPermission = function(req,res,next){
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
                        path:'/api'+req.path,
                        errorname:'404',
                    });
                }
            });
        }else{
            res.render('404',{
                title:'404错误',
                path:'/api'+req.path,
                errorname:'404',
            });
        }
    });
}

router.get('/', function(req, res) {
    res.send('hello,api');
});
router.get('/getUserList',function(req,res){
   userSchema.listUser(function(err,user){
       res.send(JSON.stringify(user));
   });
});
router.get('/ifUser/:query',function(req,res){
    var query = req.params.query;
    if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,4}/.test(query)){//is mail
        query = {mail:query};
    }else{
        query = {name:query};
    }
    userSchema.ifUser(query,function(err,user){
        res.send(JSON.stringify(user));
    });
});
router.post('/register',function(req,res){
    userSchema.register(dataToLowerCase(req.body),function(err){
        if(err!==null){
            res.send(JSON.stringify(err));
        }else{
            res.send(JSON.stringify({
                "success":1,
                "description":"注册成功。"
            }));
        }
    });
});
router.post('/login',function(req,res){
    userSchema.login(dataToLowerCase(req.body),function(err,user){
        if(err!==null){
            req.session.user = {
                uid:user._id.toString(),
                name:user.name,
                mail:user.mail,
                pw:user.password
            };
            var hour = 3600000;
            //req.session.cookie.expires = new Date(Date.now() + hour);

            /*var keepLoginTime = (60*1000*60) * 24;//24hour
            res.cookie('name', String(user.name),{ path: '/',expires: new Date(Date.now() + keepLoginTime), httpOnly: true });
            res.cookie('ma
            il', user.mail,{ path: '/',expires: new Date(Date.now() + keepLoginTime), httpOnly: true });
            res.cookie('mii_login',global.config.encryptCookie({
                name:user.name,
                mail:user.mail,
                password:user.password
            }),{
                path: '/',
                expires: new Date(Date.now() + keepLoginTime),
                httpOnly: true
            });*/
            res.send(JSON.stringify({
                "success":1,
                "descriotion":'登陆成功。'
            }));
        }else{
            res.send(JSON.stringify({
                "success":0,
                "descriotion":'帐号或密码错误。'
            }));
        }
    })
});
router.get('/logout',function(req,res){
    res.clearCookie('name', { path: '/' });
    res.clearCookie('mail', { path: '/' });
    res.clearCookie('mii_login', { path: '/' });
    res.send(JSON.stringify({
        "success":1,
        "descriotion":'退出成功。'
    }));
});
router.get('/iflogin',function(req,res){
    res.send(JSON.stringify({
        "login":req.login,
        "userInfo":{
            name:req.userData.name,
            mail:req.userData.mail
        }
    }));
});
router.get('/getUserInfo/:query',function(req,res){
    if(req.login){
        var account = req.params.query;
        if(/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,4}$/.test(account)){//mail
            userSchema.getUserInfo({
                mail:account
            },function(err,user){
                if(user!==null){
                    user.password = undefined;
                    res.send(JSON.stringify(user));
                }else{
                    res.send(JSON.stringify({
                        error:true,
                        description:'木有这个账户啊亲！！！'
                    }));
                }
            });
        }else{//name
            userSchema.getUserInfo({
                name:account
            },function(err,user){
                if(user!==null){
                    user.password = undefined;
                    res.send(JSON.stringify(user));
                }else{
                    res.send(JSON.stringify({
                        error:true,
                        description:'木有这个账户啊亲！！！'
                    }));
                }
            });
        }
    }else{
        res.json({
            error:true,
            description:'木有登陆啊亲！！！'
        });
    }
    userSchema.checkLogin(req,res,function(login){
        if(login){

        }else{

        }
    });
});
/**
 * notice api
 * */
router.get('/getUnreadNotice',function(req,res){
    if(req.login){
        noticeSchema.unreadNotice({
            uid:req.userData._id
        },function(err,data){
            if(err==null){
                res.json(data);
            }
        });
    }else{
        res.json({
            error:true,
            description:'请登录。'
        });
    }
});

router.get('/addTestNotice',function(req,res){
    if(req.login){
        noticeSchema.addTestNotice(req.userData._id,function(err){
            if(err==null){
                res.json({
                    error:false,
                    description:'添加测试通知成功:)'
                });
            }else{
                res.json({
                    err:true,
                    description:'添加测试通知失败:('
                });
            }
        });
    }else{
        res.json({
            error:true,
            description:'请登录。'
        });
    }
});

/**
 * console
 * */
//router.post('/uploadGoodImage',checkAdministratorPermission);
//router.post('/uploadGoodImage',multipartMiddleware,function(req,res){
//    console.log(req.files);
//    global.config.saveFile('blog','log',req,res);
    /*var filename = req.files.file.path.match(/[\w\-]+\.\w+$/)[0];
    var is = fs.createReadStream(req.files.file.path);
    var os = fs.createWriteStream(path.join(__dirname,"../public/upload/good/"+filename));

    util.pump(is, os, function() {
        fs.unlinkSync(req.files.file.path);
        res.send(JSON.stringify({
            error:false,
            filename:filename,
            path:'image/good/'+filename,
            url:global.config.siteUrl+'image/good/'+filename
        }));
    });*/
//});
router.post('/addGood',checkAdministratorPermission);
router.post('/addGood',function(req,res){
    var color = [req.body.color1,req.body.color2,req.body.color3,req.body.color4];
    if(color.length>1){
        for(var i=0;i<color.length;i++){
            if(i>0 && color[0]===color[i]){color.splice(i,1);i--;}
        }
    }
    if(color.length>2){
        for(var i=0;i<color.length;i++){
            if(i>1 && color[1]===color[i]){color.splice(i,1);i--;}
        }
    }
    if(color.length>3){
        if(color[2]===color[3]){color.splice(3,1);}
    }
    var goodData = {
        name:req.body.name,
        picture:req.body.picture,
        description:req.body.description,
        color:color,
        price:Number(req.body.price),
        count:{
            favorite:0,
            view:0,
            comment:0
        },
        type:'wallpaper',
        same_good:[],
        index:0
    };
    shopSchema.addGood(goodData,function(err){
        if(err===null){
            res.send(JSON.stringify({error:false}));
        }else{
            res.send(JSON.stringify(err));
        }
    });
});
/**
 * shop
 * */
router.get('/goodDetail',function(req,res){
    shopSchema.goodDetail('538e8f2bbfae6d3a5414217a',function(err,data){
        res.send(JSON.stringify({
            err:err,
            data:data
        }));
    });
});

/**
 * custom
 * */
router.post('/custom/build4print',function(req,res){
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var time = new Date();
    var fileName = time.getTime()+'_out.png';
    fs.writeFile(path.join(__dirname, '../public/image/out/'+fileName), dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            res.send(JSON.stringify({
                err:err,
                fileName:fileName
            }));
        }
    });
});

/*
* 上传文件接口
* */

router.post('/upload/:app',multipartMiddleware,function(req,res){
    var app = global.xss.text.process(req.params.app),
        savePath = global.xss.text.process(req.query.savePath.replace(/\.*/,''));
    global.config.saveFile(app,savePath,req,res,250);
});

module.exports = router;