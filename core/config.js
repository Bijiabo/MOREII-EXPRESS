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
    app = {
        index:{
            name:'index',
                cnName:'首页',
            path:'',
            ico:'fa-home',
            state:1
        },
        user:{
            name:'user',
                cnName:'用户',
            path:'user',
            ico:'fa-user',
            state:1
        },
        api:{
            name:'api',
                cnName:'核心接口',
            path:'api',
            ico:'fa-cloud',
            state:1
        },
        notice:{
            name:'notice',
                cnName:'通知',
            path:'notice',
            ico:'fa-bell',
            state:1
        },
        custom:{
            name:'custom',
                cnName:'壁纸定制',
            path:'custom',
            ico:'fa-lemon-o',
            state:0
        },
        shop:{
            name:'shop',
                cnName:'商城',
            path:'shop',
            ico:'fa-shopping-cart',
            state:0
        },
        console:{
            name:'console',
                cnName:'站点信息',
            path:'console',
            ico:'fa-terminal',
            state:1
        },
        blog:{
            name:'blog',
                cnName:'博客',
            path:'blog',
            ico:'fa-leaf',
            state:1
        },
        mobile:{
            name:'mobile',
                cnName:'移动版',
            path:'mobile',
            ico:'fa-building-o',
            state:0
        },
        tool:{
            name:'tool',
                cnName:'工具箱',
            path:'tool',
            ico:'fa-plus-square',
            state:0
        },
        comment:{
            name:'comment',
                cnName:'评论',
            path:'comment',
            ico:'fa-comment',
            state:1
        },
        class:{
            name:'class',
                cnName:'课程',
            path:'class',
            ico:'fa-bomb',
            state:1
        },
        wechat:{
            name:'wechat',
                cnName:'微信',
            path:'wechat',
            ico:'fa-wechat',
            state:1
        },
        statistics:{
            name:'statistics',
                cnName:'统计',
            path:'statistics',
            ico:'fa-eye',
            state:1
        },
        hitcat:{
            name:'hitcat',
                cnName:'打猫猫',
            path:'hitcat',
            ico:'fa-github-alt',
            state:1
        }
    };
    /*app = [
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
        },
        {
            name:'hitcat',
            cnName:'打猫猫',
            path:'hitcat',
            ico:'fa-github-alt',
            state:1
        }
    ];*/
var resError = function(req,res,des,redirectUrl,renderFile,renderData){
    if(redirectUrl===undefined || redirectUrl===false){
        var redirectUrl = '/500';
    }
    if(req.query.ajax === 'true' || req.get('X-Requested-With')!==undefined){
        res.send(JSON.stringify({
            err:true,
            des:des,
            redirectUrl:redirectUrl
        }));
    }else{
        if(renderFile!==undefined){
            var renderDataModel = function(data){
                if(data===undefined){
                    var data = {};
                }
                this.title = data.title || 'Moreii Error';
                this.cssfile=data.cssfile || '';
                this.jsfile = data.jsfile || '';
                this.siteUrl = global.config.siteUrl;
                this.nav = global.config.nav;
                this.apps = global.config.app;
                this.error = data.error;
                this.app = 'error';
                this.pretty = true;
            };
            var data = new renderDataModel({
                error:renderData
            });
            res.render(renderFile,data);
        }else{
            res.redirect(redirectUrl);
        }
    }
}

//set xss
var xss = require('xss'),
    htmlOptions = {
        whiteList:{
            a:      ['target', 'href', 'title','style'],
            abbr:   ['title'],
            address: [],
            area:   ['shape', 'coords', 'href', 'alt'],
            article: [],
            aside:  [],
            audio:  ['autoplay', 'controls', 'loop', 'preload', 'src'],
            b:      [],
            bdi:    ['dir'],
            bdo:    ['dir'],
            big:    [],
            blockquote: ['cite'],
            br:     [],
            caption: [],
            center: [],
            cite:   [],
            code:   [],
            col:    ['align', 'valign', 'span', 'width'],
            colgroup: ['align', 'valign', 'span', 'width'],
            dd:     [],
            del:    ['datetime'],
            details: ['open'],
            div:    [],
            dl:     [],
            dt:     [],
            em:     [],
            font:   ['color', 'size', 'face'],
            footer: [],
            h1:     [],
            h2:     [],
            h3:     [],
            h4:     [],
            h5:     [],
            h6:     [],
            header: [],
            hr:     [],
            i:      [],
            img:    ['src', 'alt', 'title', 'width', 'height','style'],
            ins:    ['datetime'],
            li:     ['style'],
            mark:   [],
            nav:    [],
            ol:     [],
            p:      [],
            pre:    [],
            s:      [],
            section:[],
            small:  [],
            span:   ['style'],
            strong: [],
            table:  ['width', 'border', 'align', 'valign','class'],
            tbody:  ['align', 'valign'],
            td:     ['width', 'colspan', 'align', 'valign'],
            tfoot:  ['align', 'valign'],
            th:     ['width', 'colspan', 'align', 'valign'],
            thead:  ['align', 'valign'],
            tr:     ['rowspan', 'align', 'valign'],
            tt:     [],
            u:      [],
            ul:     [],
            video:  ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width'],
            iframe:['webkitallowfullscreen','mozallowfullscreen','allowfullscreen','height','width','src','frameborder']
        }
    },
    textOptions = {
        whiteList:          [],        // 白名单为空，表示过滤所有标签
        stripIgnoreTag:     true,      // 过滤所有非白名单标签的HTML
        stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
    };  // 自定义规则
global.xss = {
    html:new xss.FilterXSS(htmlOptions),
    text:new xss.FilterXSS(textOptions)
};

module.exports = {
    cookieSecret: cookieSecret,
    domain: domain,
    siteUrl:'http://'+domain+':'+port+'/',
    port:port,
    siteName:siteName,
    logo:logo,
    app:app,
    version:'3.0.1',
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
    resError: resError,
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

    },
    changeRoute:function(originPath,newPath){
        var routeRegexpCache = '',
            matchCache = [];
        for(var i= 0,len=global.app._router.stack.length;i<len;i++){
            //routeRegexpCache = global.app._router.stack[i].regexp.toString().replace('/^\\/','').replace('\\/?(?=/|$)/i','').replace('/^/','').replace('/?(?=/|$)/i','').replace('?(?=/|$)/i','');
            matchCache = global.app._router.stack[i].regexp.toString().match(/\w{2,}/ig);
            if(matchCache!==null){
                matchCache = matchCache[0];
                if(matchCache === originPath){
                    console.log(matchCache);
                    global.app._router.stack[i].regexp = new RegExp('^\/'+newPath+'\/?(?=/|$)','i');
                }
//                console.log(matchCache);
            }
        }
    },
    checkPermission:function(req,res,app,permission,redirect,callback){
        if(req.login){
            if(req.permission[app][permission]){
                callback(true);
            }else{
                callback(false);
                if(redirect){
                    resError(req,res,'权限不足。',false,'error',{
                        title:'权限不足',
                        des:'您的档案库中无此项进入权限。'
                    });
                }
            }
        }else{
            callback(false);
            if(redirect){
                resError(req,res,'请登录。','/user/login');
            }
        }
    }
};