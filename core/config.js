/**
 * Created by boooo on 14-5-23.
 */
var crypto = require('crypto'),
    fs = require('fs'),
    util = require('util'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    cookieSecret = 'hcblhy10260326',
    encryptCookie = function(data){//加密cookie
        var sha1 = crypto.createHash('sha1');
        var dataString=cookieSecret;
        for(var item in data){
            dataString+=String(data[item]);
        }
        sha1.update(dataString);
        return sha1.digest('hex');
    },
    domain = 'localhost',//站点域名
    port = '3001',
    siteName = 'Moreii',
    logo = 'Moreii',
    app = [
        {
            name:'index',
            cnName:'首页',
            path:'',
            ico:'fa-home',
            state:1
        },
        {
            name:'user',
            cnName:'用户',
            path:'user',
            ico:'fa-user',
            state:1
        },
        {
            name:'api',
            cnName:'核心接口',
            path:'api',
            ico:'fa-cloud',
            state:1
        },
        {
            name:'notice',
            cnName:'通知',
            path:'notice',
            ico:'fa-bell',
            state:1
        },
        {
            name:'custom',
            cnName:'壁纸定制',
            path:'custom',
            ico:'fa-lemon-o',
            state:0
        },
        {
            name:'shop',
            cnName:'商城',
            path:'shop',
            ico:'fa-shopping-cart',
            state:0
        },
        {
            name:'console',
            cnName:'站点信息',
            path:'console',
            ico:'fa-terminal',
            state:1
        },
        {
            name:'blog',
            cnName:'博客',
            path:'blog',
            ico:'fa-leaf',
            state:1
        },
        {
            name:'mobile',
            cnName:'移动版',
            path:'mobile',
            ico:'fa-building-o',
            state:0
        },
        {
            name:'tool',
            cnName:'工具箱',
            path:'tool',
            ico:'fa-plus-square',
            state:0
        },
        {
            name:'comment',
            cnName:'评论',
            path:'comment',
            ico:'fa-comment',
            state:1
        },
        {
            name:'class',
            cnName:'课程',
            path:'class',
            ico:'fa-bomb',
            state:1
        },
        {
            name:'wechat',
            cnName:'微信',
            path:'wechat',
            ico:'fa-wechat',
            state:1
        },
        {
            name:'statistics',
            cnName:'统计',
            path:'statistics',
            ico:'fa-eye',
            state:1
        }
    ];

module.exports = {
    cookieSecret: cookieSecret,
    domain: domain,
    siteUrl:'http://'+domain+':'+port+'/',
    port:port,
    siteName:siteName,
    logo:logo,
    app:app,
    version:'3.0.0',
    nav:[
        {
            text:'首页',
            app:'index',
            href:''
        },
        {
            text:'博客',
            app:'blog',
            href:'blog'
        }
    ],
    encryptCookie:encryptCookie,
    inArray:function (needle,array,bool){
        if(typeof needle=="string"||typeof needle=="number"){
            var len=array.length;
            for(var i=0;i<len;i++){
                if(needle===array[i]){
                    if(bool){
                        return i;
                    }
                    return true;
                }
            }
            return false;
        }
    },
    resError: function(req,res,des,redirectUrl){
        if(req.query.ajax === 'true'){
            res.send(JSON.stringify({
                err:true,
                des:des,
                redirectUrl:redirectUrl
            }));
        }else{
            res.redirect(redirectUrl);
        }
    },
    securityFilter:function(x){
        if(typeof x==='string') {//过滤字符串
            x= x.replace(/[\<\>\&\#]+/ig,'');
        }
        return x;
    },
    saveFile:function(app,savePath,req,res){
        var filename = path.basename(req.files.file.path),
            is = fs.createReadStream(req.files.file.path),
            savedPath = path.join(__dirname,'../public/upload/',app,savePath);
        fs.exists(savedPath,function(exists){
            if(!exists){
                //no such path,create it
                var pathArray = savePath.split(path.sep);
                mkdirp(savedPath, function (err) {
                    if(err){
                        console.error(err);
                    }else{
                        console.log('pow!');
                        var os = fs.createWriteStream(path.join(savedPath,filename));
                        util.pump(is, os, function() {
                            fs.unlinkSync(req.files.file.path);
                            res.json({
                                error:false,
                                filename:filename,
                                path:'upload/'+app+'/'+savePath+'/'+filename,
                                url:'http://'+domain+':'+port+'/'+'upload/'+app+'/'+savePath+'/'+filename
                            });
                        });
                    }
                });
            }else{
                var os = fs.createWriteStream(path.join(savedPath,filename));
                util.pump(is, os, function() {
                    fs.unlinkSync(req.files.file.path);
                    res.json({
                        error:false,
                        filename:filename,
                        path:'upload/'+app+'/'+savePath+'/'+filename,
                        url:'http://'+domain+':'+port+'/'+'upload/'+app+'/'+savePath+'/'+filename
                    });
                });
            }
        });

    }
};