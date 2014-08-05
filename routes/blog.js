var express = require('express'),
    config = require('../core/config'),
    userSchema = require('../core/schema/user'),
    blogSchema = require('../core/schema/blog'),
    noticeSchema = require('../core/schema/notice'),
    statisticsSchema = require('../core/schema/statistics'),
    short = require('short'),
    markdown = require( "markdown" ).markdown;
short.connect('mongodb://localhost/moreii');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii Blog';
    this.jsfile = data.jsfile ||'blog.js';
    this.cssfile = data.cssfile || 'blog.css';
    this.siteUrl = config.siteUrl;
    this.blogData = data.blogData ||{title:'',content:'',tag:[],_id:''};
    this.app = 'blog';
    this.apps = config.app;
    this.nav = config.nav;
    this.consoleNav = [
        {
            name:'管理首页',
            path:''
        },
        {
            name:'文章列表',
            path:'bloglist'
        },
        {
            name:'作者统计',
            path:'authors'
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.pretty = true;
    };
/* GET home page. */
router.get('/', function(req, res) {
//    console.log('here');
    var page = 0,
        limitPerPage = 5;
    if(req.query.page!==undefined){
        page = Number(req.query.page) - 1;
    }
    var data = new renderData({
        title : 'Moreii团队博客'
    });
    blogSchema.listBlog({state:1},limitPerPage*page,limitPerPage,function(err,blogData){
        if(err===null && blogData.length!==0) {
            for (var i = 0; i < blogData.length; i++) {
                console.log(blogData[i].format);
                if(blogData[i].format !== 'html'){
                    blogData[i].content = markdown.toHTML(String(blogData[i].content));
                }
            }
            data.blogData = blogData;
            blogSchema.getListItemCount({state: 1}, function (err1, countData) {
                if (err1 === null) {
                    data.pageUrl = config.siteUrl + data.app + '/?page=';
                    data.pageCount = Math.ceil(countData / limitPerPage);
                    data.pageNow = page + 1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/index', data);
                } else {
                    res.redirect(config.siteUrl + '500');
                }
            });
        }else if(err===null && blogData.length===0){
            console.log(blogData);
            data.blogData = blogData;
            data.pageUrl = config.siteUrl + data.app + '/?page=';
            data.pageCount = 0;
            data.pageNow = page + 1;
            data.limitPerPage = limitPerPage;
            data.pagerLen = 5;//翻页控件显示页数
            res.render('blog/index', data);
        }else{
            res.redirect(config.siteUrl+'404');
        }
    });
});
router.get('/search/tag/:tags/:page?',function(req,res){
    var page = 0,
        limitPerPage = 10;
    if(req.params.page!==undefined){
        page = req.params.page;
    }
    var tagArray = req.params.tags.split('+');
    var data = new renderData({
        title : 'Moreii团队博客'
    });
    blogSchema.findByTags(tagArray,{"_id":1},0,10,function(err,blogData){
        if(err===null && blogData.length!==0){
            for(var i=0;i<blogData.length;i++){
                if(blogData[i].format !== 'html'){
                    blogData[i].content = markdown.toHTML(String(blogData[i].content));
                }
            }
            data.blogData = blogData;
            blogSchema.getListItemCount({tag:{"$all":tagArray}},function(err1,countData){
                if(err1===null){
                    data.pageUrl = config.siteUrl+data.app+'/?page=';
                    data.pageCount = Math.ceil(countData/limitPerPage);
                    data.pageNow = page+1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/index', data);
                }else{
                    res.redirect(config.siteUrl+'500');
                }
            });
        }else{
            data.errorTitle = '未找到相关内容。'
            data.errorDes = '请尝试搜索其他标签或关键词。'
            res.render('blog/404',data);
        }
    });
});
router.get('/detail/:id/:page?', function(req, res) {
    var page = Number(req.params.page);
    if(req.params.page===undefined || isNaN(page) || page<1){
        page = 1;
    }
    userSchema.checkLogin(req,res,function(login){
        if(login){
            userSchema.getUserInfo({
                name:req.cookies.name,
                mail:req.cookies.mail
            },function(err,userData){
                if(err===null){
                    var sendErr = function(r,err){
                        r.json({
                            err:true
                        });
                    }
                    /*
                    * 搞起文章url跳转
                    * for 小胡老师
                    * */
                    var shortURLPromise = short.generate({
                        URL : config.siteUrl+'blog/detail/'+req.params.id+'?userId='+String(userData._id),
                        data:{
                            blogId:req.params.id,
                            userId:String(userData._id)
                        }
                    });
                    shortURLPromise.then(function(mongodbDoc) {
                        short.retrieve(mongodbDoc.hash).then(function(result) {
                        //process.exit(0);
                            res.redirect(config.siteUrl+'blog/article/'+result.hash);
                        }, function(error) {
                            if (error) {
                                //throw new Error(error);
                                sendErr(res);
                            }
                        });
                    }, function(error) {
                        if (error) {
                            //throw new Error(error);
                            sendErr(res);
                        }
                    });
                }else{
                    res.redirect(config.siteUrl+'user/login');
                }
            });
        }else{
            var data = new renderData();
            blogSchema.blogDetail(req.params.id,function(err,blogData){
                if(err===null && blogData!==null){
                    if(blogData.info.state===1){
                        if(page<=blogData.content.length){
                            blogData.pageCount = blogData.content.length;//获取分页数量
                            if(blogData.info.format !== 'html'){
                                blogData.content= markdown.toHTML(blogData.content[page-1].content);
                            }else{
                                blogData.content= blogData.content[page-1].content;
                            }
                            data.blogData = blogData;
                            blogSchema.blogDetailView(req.params.id,function(err1){
                                if(err1===null){
                                    data.pageUrl = config.siteUrl+data.app+'/detail/'+req.params.id+'/';
                                    data.pageCount = blogData.pageCount;
                                    data.pageNow = page;
                                    data.limitPerPage = 1;
                                    data.pagerLen = 5;//翻页控件显示页数
                                    res.render('blog/detail', data);
                                }else{
                                    res.redirect(config.siteUrl+'500');
                                }
                            });
                        }else{
                            res.render('404',{
                                title:'404错误',
                                path:'/blog'+req.path,
                                errorname:'404'
                            });
                        }
                    }else{
                        res.redirect(config.siteUrl+'404');
                    }
                }else{
                    res.redirect(config.siteUrl+'404');
                }
            });
        }
    })
});
//短连接神马的，最有爱了 >3</
router.get('/article/:shorturl/:page?',function(req,res){
    var page = Number(req.params.page);
    if(req.params.page===undefined || isNaN(page) || page<1){
        page = 1;
    }
    var sendErr = function(r,err){
        r.json({
            err:true
        });
    }

    var shortURLPromise = short.retrieve(String(req.params.shorturl)).then(function(result) {
        var data = new renderData();
        userSchema.checkLogin(req,res,function(login){
            if(login){
                //记录原链接会员积分
                //跳转至本会员的新链接
                userSchema.getUserInfo({
                    name:req.cookies.name,
                    mail:req.cookies.mail
                },function(err,userData){
                    if(err===null){
                        var shortURLPromise = short.generate({
                            URL : config.siteUrl+'blog/detail/'+result.data.blogId+'?userId='+String(userData._id),
                            data:{
                                blogId:result.data.blogId,
                                userId:String(userData._id)
                            }
                        });
                        shortURLPromise.then(function(mongodbDoc) {
                            short.retrieve(mongodbDoc.hash).then(function(result) {
                                //process.exit(0);
//                                if(result.hash!==req.params.shorturl){//非私有链接，跳转到会员自己的私有链接
//                                    res.redirect(config.siteUrl+'blog/article/'+result.hash);
//                                }else{
                                    blogSchema.blogDetail(result.data.blogId,function(err,blogData){
                                        if(err===null && blogData!==null){
                                            if(blogData.info.state===1){
                                                if(page<=blogData.content.length){
                                                    blogData.pageCount = blogData.content.length;//获取分页数量
                                                    if(blogData.info.format !== 'html'){
                                                        blogData.content= markdown.toHTML(blogData.content[page-1].content);
                                                    }else{
                                                        blogData.content= blogData.content[page-1].content;
                                                    }
                                                    data.blogData = blogData;
                                                    /**
                                                     * 编辑和修订权限 - 前台显示
                                                     * */
                                                    if(userData._id.toString()===blogData.info.author.id){//判断是否为用户自己的文章
                                                        data.blogData.isMyArticle = true;
                                                    }else if(userData.permission.blog.revise){//判断是否有修订权限
                                                        data.blogData.hasRevisePermission = true;
                                                    }
                                                    blogSchema.blogDetailView(result.data.blogId,function(err1){
                                                        if(err1===null){
                                                            data.pageUrl = config.siteUrl+data.app+'/article/'+req.params.shorturl+'/';
                                                            data.pageCount = blogData.pageCount;
                                                            console.log(blogData.pageCount);
                                                            data.pageNow = page;
                                                            data.limitPerPage = 1;
                                                            data.pagerLen = 5;//翻页控件显示页数
                                                            res.render('blog/detail', data);
                                                        }else{
                                                            res.redirect(config.siteUrl+'500');
                                                        }
                                                    });
                                                }else{
                                                    console.log(err);
                                                    res.redirect(config.siteUrl+'404');
                                                }
                                            }else{
                                                res.redirect(config.siteUrl+'404');
                                            }
                                        }else{
                                            res.redirect(config.siteUrl+'404');
                                        }
                                    });
//                                }
                            }, function(error) {
                                if (error) {
//                                    throw new Error(error);
                                    res.redirect(config.siteUrl+'404');
                                }
                            });
                        }, function(error) {
                            if (error) {
//                                throw new Error(error);
                                res.redirect(config.siteUrl+'404');
                            }
                        });
                    }else{
                        res.redirect(config.siteUrl+'404');
                    }
                });
            }else{
                blogSchema.blogDetail(result.data.blogId,function(err,blogData){
                    if(err===null){
                        if(page<blogData.content.length){
                            if(blogData.info.format!=='html'){
                                blogData.content= markdown.toHTML(blogData.content[page-1].content);
                            }else{
                                blogData.content= blogData.content[page-1].content;
                            }
                            data.blogData = blogData;
                            blogSchema.blogDetailView(result.data.blogId,function(err1){
                                if(err1===null){
                                    res.render('blog/detail', data);
                                }else{
                                    res.redirect(config.siteUrl+'500');
                                }
                            });
                        }else{
                            res.redirect(config.siteUrl+'404');
                        }
                    }else{
                        res.redirect(config.siteUrl+'404');
                    }
                });
            }
        });
    },function(error) {
        if (error) {
//          throw new Error(error);
            res.redirect(config.siteUrl+'404');
        }
    });
});
//随机日志api
router.get('/api/randomBlog/:limit?',function(req,res){
    var limit = Number(req.params.limit);
    if(isNaN(limit) || limit<=0){
        limit = 10;
    }
    blogSchema.randomBlog(limit,function(err,data){
        if(err===null){
            res.json({
                err:false,
                data:data
            });
        }else{
            res.json({
                err:true,
                des:'数据错误。'
            });
        }
    });
});


/**
 * 已登陆用户功能
 * */
var isLogin = function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            config.resError(req,res,'请登陆。','/user/login');
        }
    });
}
/*router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            if(req.query.ajax === 'true'){
                res.json({
                    err:true,
                    des:'请登陆啊亲>_<'
                });
            }else{
                res.redirect('/user/login');
            }
        }
    });
});*/

router.get('/getShareUrl/:id',isLogin);
router.get('/getShareUrl/:id',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var sendErr = function(r,err){
                r.json({
                    err:true
                });
            }
            var shortURLPromise = short.generate({
                URL : config.siteUrl+'blog/detail/'+req.params.id+'?userId='+String(userData._id),
                data:{
                    blogId:req.params.id,
                    userId:String(userData._id)
                }
            });
            shortURLPromise.then(function(mongodbDoc) {
                short.retrieve(mongodbDoc.hash).then(function(result) {
//            process.exit(0);
                    res.send(JSON.stringify({
                        err:null,
                        url:result.hash
                    }));
                }, function(error) {
                    if (error) {
//                throw new Error(error);
                        sendErr(res);
                    }
                });
            }, function(error) {
                if (error) {
//            throw new Error(error);
                    sendErr(res);
                }
            });
        }else{
            res.json({
                error:true,
                des:'请登录啊亲'
            });
        }
    });
});


/**
 * editor----------------------------------------------------------------------------------
 * api
 * */

var isEditor = function(req,res,next){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            if(userData.permission.blog.edit){//拥有修改文章的权限
                next();
            }else{//无修改文章的权限
                config.resError(req,res,'权限不足。');
            }
        }else{
            config.resError(req,res,'数据错误。');
        }
    });
}
/*router.use(function(req,res,next){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            if(userData.permission.blog.edit){//拥有修改文章的权限
                next();
            }else{//无修改文章的权限
                config.resError(req,res,'权限不足。');
            }
        }else{
            config.resError(req,res,'数据错误。');
        }
    });
});*/
router.get('/write',isEditor);
router.get('/write',function(req,res){
    var rData = new renderData({
        title : 'Moreii团队博客 - 书写日志',
        jsfile: 'blog_admin.js'
    });
    res.render('blog/write', rData);
});

router.get('/edit/:blogId',isEditor);
router.get('/edit/:blogId',function(req,res){
    blogSchema.blogDetail(req.params.blogId,function(err,blogData){
        if(err===null){
            var rData = new renderData({
                title : 'Moreii团队博客 - 编辑日志',
                jsfile: 'blog_admin.js',
                blogData : blogData
            });
            res.render('blog/edit', rData);
        }else{
            res.send(JSON.stringify({
                error:true,
                errorInfo:err
            }));
        }
    });
});

router.post('/api/add',isEditor);
router.post('/api/add',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var blogData = {
                title:req.body.title,
                content:req.body.content,
                tag:req.body.tag,
                author:{
                    id:userData._id,
                    name:userData.name
                }
            };
            blogSchema.add(blogData,function(err,blogSaved){
                if(err===null){
                    res.json({
                        error:false,
                        blogId:blogSaved._id.toString()
                    });
                }else{
                    res.json({
                        error:true,
                        errorInfo:err
                    });
                }
            });
        }else{
            res.json({
                error:true,
                errorInfo:err
            });
        }
    });
});
router.post('/api/update/:id',isEditor);
router.post('/api/update/:id',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null && userData!==null){
            /**
             * 判断是否为本人文章
             * */
            blogSchema.blogDetail(req.params.id,function(err1,originalBlogData){
                if(err1===null && originalBlogData!==null){
                    if(originalBlogData.info.author.id === userData._id.toString()){//本人文章
                        var blogData = {
                            title:req.body.title,
                            content:req.body.content,
                            tag:req.body.tag
                        };
                        blogSchema.update(req.params.id,blogData,userData,function(err2){
                            if(err===null){
                                res.json({
                                    error:false,
                                    blogId:req.params.id
                                });
                            }else{
                                res.json({
                                    error:true,
                                    errorInfo:err2
                                });
                            }
                        });
                    }else if(userData.permission.blog.revise===true){//非本人文章，但有修订权限,我不会说这两种情况下代码是暂时一样的...
                        var blogData = {
                            title:req.body.title,
                            content:req.body.content,
                            tag:req.body.tag
                        };
                        blogSchema.update(req.params.id,blogData,userData,function(err,version){
                            if(err===null){
                                /*
                                * 添加消息到notice
                                * */
                                noticeSchema.send(originalBlogData.info.author.id,originalBlogData.info.author.name,
                                    'blog',
                                    {
                                        type:'修订',
                                        blogId:req.params.id
                                    },
                                        '您的文章"'+originalBlogData.info.title+'"被"'+userData.name+'"修订，版本号：'+ version,
                                    'systemInfo',
                                        config.siteUrl+'blog/detail/'+req.params.id,
                                    function(err){
                                        if(err===null){
                                            res.json({
                                                error:false,
                                                blogId:req.params.id
                                            });
                                        }else{
                                            res.json({
                                                error:true,
                                                errorInfo:err
                                            });
                                        }
                                    });
                            }else{
                                res.json({
                                    error:true,
                                    errorInfo:err
                                });
                            }
                        });
                    }else{
                        res.json({
                            err:true,
                            des:'权限不足。'
                        });
                    }
                }else{
                    res.json({
                        err:true,
                        des:'目标文章不存在。'
                    });
                }
            });

        }else{
            res.json({
                error:true,
                des:err
            });
        }
    });
});
//后台首页
router.get('/console',isEditor);
router.get('/console',function(req,res){
    var data = new renderData({
        title:'博客模块',
        jsfile:'blog_admin.js',
        cssfile:'blog_console.css',
        consoleNavActive:''
    });
    var dateNow = new Date();
    var month = dateNow.getMonth()+ 1,
        year = dateNow.getFullYear();
    blogSchema.statisticBlogByMonth(year,month,function(err,statisticBlogData){
       if(err===null){
           data.statisticBlogData = statisticBlogData;
           statisticsSchema.statisticBlogViewByMonth(year,month,function(err1,statisticBlogView){
                if(err1===null){
                    data.blogView = statisticBlogView;
                    res.render('blog/console/index',data);
                }else{
                    res.redirect(config.siteUrl+'500');
                }
           });
       }else{
           res.redirect(config.siteUrl+'500');
       }
    });
});
//统计作者数据
router.get('/console/authors',isEditor);
router.get('/console/authors',function(req,res){
    var data = new renderData({
        title:'博客作者统计',
        jsfile:'blog_admin.js',
        cssfile:'blog_console.css',
        consoleNavActive:'authors'
    });
    blogSchema.statisticAuthor(10,function(err,authorData){
        if(err===null && authorData!==null){
            data.authorData = authorData;
        }
        res.render('blog/console/authors',data);
    });
});
//内容管理列表
router.get('/console/bloglist/:page?',isEditor);
router.get('/console/bloglist/:page?',function(req,res){
    var page = Number(req.params.page),
        limitPerPage = 3;
    if(isNaN(page) || page<1){
        page=1;
    }
//    page=page-1;
    if(req.params.page && !isNaN(Number(req.params.page))){
        page = Number(req.params.page);
    }
    blogSchema.listBlog({state:1},(page-1)*limitPerPage,limitPerPage,function(err,blogData){
        if(err===null && blogData.length>0){
            var data = new renderData({
                title:'文章列表',
                jsfile:'blog_admin.js',
                cssfile:'blog_console.css',
                consoleNavActive:'bloglist'
            });
            data.blogData = blogData;
            blogSchema.getListItemCount({state:1},function(err1,countData){
                if(err1===null){
                    data.pageUrl = config.siteUrl+data.app+'/console/bloglist/';
                    data.pageCount = Math.ceil(countData/limitPerPage);
                    data.pageNow = page;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/console/loglist',data);
                }else{
                    res.redirect(config.siteUrl+'500');
                }
            });
        }else{
            res.redirect(config.siteUrl+'500');
        }
    });
});
//删除日志
router.post('/api/deleteBlogs',isEditor);
router.post('/api/deleteBlogs',function(req,res){
    if(req.body.idArray){
        if(req.body.idArray.constructor.toString().match('Array') && req.body.idArray!==[]){
            blogSchema.deleteBlogs(req.body.idArray,function(err,data){
                if(err===null){
                    res.json({
                        err:false
                    });
                }else{
                    res.json({
                        err:true,
                        des:'数据错误。'
                    });
                }
            });
        }else{
            res.json({
                err:true,
                des:'提交数据错误，请刷新后重试。'
            });
        }
    }else{
        res.json({
            err:true,
            des:'提交数据错误，请刷新后重试。'
        });
    }
});
//获取日志内容api
router.get('/api/getBlogDetail/:id',isEditor);
router.get('/api/getBlogDetail/:id',function(req,res){
    blogSchema.blogDetail(req.params.id,function(err,blogData){
        if(err===null && blogData!==null){
            res.json({
                err:false,
                data:blogData
            });
        }else{
            res.json({
                err:true,
                des:'数据错误。'
            });
        }
    });
});

module.exports = router;
