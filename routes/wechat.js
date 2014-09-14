var express = require('express'),
    blogSchema = require('../core/schema/blog'),
    wechat = require('wechat');
var router = express.Router();
var token = 'moreiiexpresswechattoken';//微信token
//测试微信openID o9ryIjmo7OPx6ZM2OMpeiGL72o38
var API = wechat.API;
var api = new API('wx79b29da384200d59', '4b00d123c5acf57a897da59a4b430ad8');

var renderData = function(data){
    if(data===undefined){
        data = {};
    }
    this.title = data.title || '微信';
    this.cssfile = data.cssfile || 'wechat_console.css';
    this.jsfile = data.jsfile ||'';
    this.app = 'wechat';
    this.consoleNav = [
        {
            name:'管理首页',
            path:''
        },
        {
            name:'管理员列表',
            path:'editors'
        },
        {
            name:'群发消息',
            path:'mssSendNews'
        },
        {
            name:'关于',
            path:'about'
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.appVersion = '0.0.1';
}

router.get('/', function(req, res) {
    var data = new renderData();
    res.render('index', data);
});
/**
 * api
 * */
router.use('/api', wechat(token)
    .text(function(message,req,res,next){
            var times = Math.floor(Math.random()*10)+1,
                replyString = '';
            for(var i=0;i<times;i++){
                if(i>0 && Math.random()>0.7){
                    replyString+='喵～'
                }else if(i>0 && Math.random()>0.8){
                    replyString+='～'
                }else if(i>0 && Math.random()>0.9){
                    replyString+=' '
                }else{
                    replyString+='喵'
                }
            }
            res.reply(replyString);
    }).image(function(message,req,res,next){
            res.reply('暂不支持图像识别。');
    }).voice(function(message,req,res,next){
            res.reply('语音识别啊，没认证呢还。');
    }).video(function(message,req,res,next){
            res.reply('你给我传的是毛片么亲？！');
    }).location(function(message,req,res,next){
            res.reply('系统目前不支持约泡，别告诉我你在哪儿=_=');
    }).link(function(message,req,res,next){
            res.reply('回头我看看');
    }).event(function(message,req,res,next){
            if(message.Event === 'CLICK'){
                switch (message.EventKey){
                    case 'randomBlog':
                        blogSchema.randomBlog(function(err,blogData){
                            if(err===null && blogData!==null){
                                res.reply([
                                    {
                                        title: blogData.title,
                                        description: '点击阅读全文',
                                        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                                        url: global.config.siteUrl+'blog/detail/'+blogData._id.toString()+'?openId='+message.FromUserName
                                    }
                                ]);
                            }else{
                                res.reply([
                                    {
                                        title: '暂无日志',
                                        description: '某人又偷懒了，你懂得。',
                                        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                                        url: global.config.siteUrl+'blog/'+'?openId='+message.FromUserName
                                    }
                                ]);
                            }
                        });
                        break;
                    default :
                        res.reply('各种功能开发中，请勿扰。');
                }
            }else{
                res.reply('hello,world.');
            }
    }).middlewarify()
);
/*
* 登陆后页面
* */
router.use(function(req,res,next){
    if(req.login){
        next();
    }else{
        global.config.resError(req,res,'请登陆。','/user/login');
    }
});
/*
* 后台配置界面
* */
router.use(function(req,res,next){
    if(req.userData.permission.user.editUser) {
        next();
    }else if(req.userData.permission.wechat){
        if(req.userData.permission.wechat.edit){
            next();
        }else{
            global.config.resError(req,res,'权限不足');
        }
    }else{
        global.config.resError(req,res,'权限不足');
    }
});
router.get('/console',function(req,res){
    var data = new renderData({});
    res.render('wechat/console/index',data);
});
router.get('/console/editors/:page?',function(req,res){
    var page = Number(req.params.page),
        limitPerPage = 10;
    if(isNaN(page) || page<1){
        page=1;
    }
    global.userSchema.findUser({'permission.wechat.edit':true},{'_id':-1},(page-1)*limitPerPage,limitPerPage,function(err,userData){
        if(!err && userData){
            global.userSchema.getListItemCount({'permission.wechat.edit':true},function(err1,countData){
                if(!err1){
                    var data = new renderData({
                        title:'管理员列表',
                        consoleNavActive:'editors'
                    });
                    data.users = userData;
                    data.pageUrl = global.config.siteUrl+data.app+'/console/editors/';
                    data.pageCount = Math.ceil(countData/limitPerPage);
                    data.pageNow = page;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    console.log(userData);
                    res.render('wechat/console/editors',data);
                }else{
                    res.render('error',{
                        error:{
                            title:'错误代码：WECHATCONSOLEEDITOR0002',
                            des:'分页数据错误，请刷新页面后重试。'
                        }
                    });
                }
            });
        }else{
            res.render('error',{
                error:{
                    title:'错误代码：WECHATCONSOLEEDITOR0001',
                    des:'拉取用户数据错误，请刷新页面后重试。'
                }
            });
        }
    });
});
router.get('/console/mssSendNews',function(req,res){
    //群发图文消息页面
    var data = new renderData({
        title:'群发消息-图文',
        consoleNavActive:'mssSendNews'
    });
    console.log('===============');
    res.render('wechat/console/masssendnews',data);
});
/*
* 后台管理api
* */
router.post('/api/uploadMedia',function(req,res){
    //上传媒体文件
    api.uploadMedia(req.body.filePath, req.body.type, function(err,result){
        console.log('-----------------------');
        console.log(err);
        console.log(result);
    });
});
router.post('/api/massSendNews',function(req,res){
   //群发消息
//    api.massSend(opts, receivers, callback);
});

module.exports = router;
