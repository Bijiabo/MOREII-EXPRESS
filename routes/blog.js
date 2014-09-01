var express = require('express'),
    userSchema = require('../core/schema/user'),
    blogSchema = require('../core/schema/blog'),
    noticeSchema = require('../core/schema/notice'),
    statisticsSchema = require('../core/schema/statistics'),
    short = require('short'),
    markdown = require( "markdown" ).markdown;
short.connect('mongodb://localhost/moreii');
var router = express.Router();
/*
 * 博客模块参数设定
 * */
var limitPerPage = 5,
    renderData = function(data){
    if(data===undefined){
        data = {};
    }
    this.title = data.title || 'MOREII团队博客';
    this.jsfile = data.jsfile ||'blog.js';
    this.cssfile = data.cssfile || 'blog.css';
    this.siteUrl = global.config.siteUrl;
    this.blogData = data.blogData ||{title:'',content:'',tag:[],_id:''};
    this.app = 'blog';
    this.apps = global.config.app;
    this.nav = global.config.nav;
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
    var page = 0;
    if(!isNaN(Number(req.query.page))){
        page = Number(req.query.page) - 1;
    }
    var data = new renderData();
    blogSchema.listBlog({state:1,type:'blog'},limitPerPage*page,limitPerPage,function(err,blogData){
        if(err===null && blogData.length!==0) {
            for (var i = 0,len=blogData.length; i < len; i++) {
                console.log(blogData[i].format);
                if(blogData[i].format !== 'html'){
                    blogData[i].content = markdown.toHTML(String(blogData[i].content));
                }
            }
            data.blogData = blogData;
            blogSchema.getListItemCount({state: 1,type:'blog'}, function (err1, countData) {
                if (err1 === null && !isNaN(countData)) {
                    data.pageUrl = global.config.siteUrl + data.app + '/?page=';
                    data.pageCount = Math.ceil(countData / limitPerPage);
                    data.pageNow = page + 1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/index', data);
                } else {
                    res.redirect(global.config.siteUrl + '500');
                }
            });
        }else if(err===null && blogData.length===0){
            console.log(blogData);
            data.blogData = blogData;
            data.pageUrl = global.config.siteUrl + data.app + '/?page=';
            data.pageCount = 0;
            data.pageNow = page + 1;
            data.limitPerPage = limitPerPage;
            data.pagerLen = 5;//翻页控件显示页数
            res.render('blog/index', data);
        }else{
            res.redirect(global.config.siteUrl+'404');
        }
    });
});
/*
* 搜索标签
* */
router.get('/search/tag/:tags/:page?',function(req,res){
    var page = 0;
    if(req.params.page!==undefined){
        page = req.params.page;
    }
    var tagArray = req.params.tags.split('+');
    var data = new renderData();
    blogSchema.findByTags(tagArray,{"_id":1},0,10,function(err,blogData){
        if(err===null && blogData.length!==0){
            for(var i=0;i<blogData.length;i++){
                if(blogData[i].format !== 'html'){
                    blogData[i].content = markdown.toHTML(String(blogData[i].content));
                }
            }
            data.blogData = blogData;
            blogSchema.getListItemCount({tag:{"$all":tagArray},state:1},function(err1,countData){
                if(err1===null){
                    data.pageUrl = global.config.siteUrl+data.app+'/?page=';
                    data.pageCount = Math.ceil(countData/limitPerPage);
                    data.pageNow = page+1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/index', data);
                }else{
                    res.redirect(global.config.siteUrl+'500');
                }
            });
        }else{
            data.errorTitle = '未找到相关内容。'
            data.errorDes = '请尝试搜索其他标签或关键词。'
            res.render('blog/404',data);
        }
    });
});
/*
* 搜索作者
* */
router.get('/search/author/:author/:page?',function(req,res){
    var author = global.xss.text.process(req.params.author);
    var page = 0;
    if(!isNaN(Number(req.query.page))){
        page = Number(req.query.page) - 1;
    }
    var data = new renderData();
    blogSchema.listBlog({"author.name":author,type:'blog',state:1},limitPerPage*page,limitPerPage,function(err,blogData){
        if(err===null && blogData.length!==0) {
            for (var i = 0; i < blogData.length; i++) {
                console.log(blogData[i].format);
                if(blogData[i].format !== 'html'){
                    blogData[i].content = markdown.toHTML(String(blogData[i].content));
                }
            }
            data.blogData = blogData;
            blogSchema.getListItemCount({"author.name":author,type:'blog',state:1}, function (err1, countData) {
                if (err1 === null) {
                    data.pageUrl = global.config.siteUrl + data.app + '/search/author/'+author+'/';
                    data.pageCount = Math.ceil(countData / limitPerPage);
                    data.pageNow = page + 1;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/index', data);
                } else {
                    res.redirect(global.config.siteUrl + '500');
                }
            });
        }else if(err===null && blogData.length===0){
            console.log(blogData);
            data.blogData = blogData;
            data.pageUrl = global.config.siteUrl + data.app + '/?page=';
            data.pageCount = 0;
            data.pageNow = page + 1;
            data.limitPerPage = limitPerPage;
            data.pagerLen = 5;//翻页控件显示页数
            res.render('blog/index', data);
        }else{
            res.redirect(global.config.siteUrl+'404');
        }
    });
});
/*
* 博客日志详情页面
* */
router.get('/detail/:id/:page?', function(req, res) {
    var page = Number(req.params.page);
    if(req.params.page===undefined || isNaN(page) || page<1){
        page = 1;
    }
    if(req.login){
        /*
         * 搞起文章url跳转
         * for 小胡老师
         * */
        var shortURLPromise = short.generate({
            URL : global.config.siteUrl+'blog/detail/'+req.params.id+'?userId='+String(req.userData._id),
            data:{
                blogId:req.params.id,
                userId:String(req.userData._id)
            }
        });
        shortURLPromise.then(function(mongodbDoc) {
            short.retrieve(mongodbDoc.hash).then(function(result) {
                res.redirect(global.config.siteUrl+'blog/article/'+result.hash);
            }, function(error) {
                if (error) {
                    global.config.resError(req,res,'数据错误');
                }
            });
        }, function(error) {
            if (error) {
                global.config.resError(req,res,'数据错误');
            }
        });
    }else{
        //未登陆用户访问
        var data = new renderData();
        blogSchema.blogDetail(req.params.id,function(err,blogData){
            if(err===null && blogData!==null && blogData.info){
                if(blogData.info.state===1 && page<=blogData.content.length){
                    blogData.pageCount = blogData.content.length;//获取分页数量
                    if(blogData.info.format !== 'html'){
                        blogData.content= markdown.toHTML(blogData.content[page-1].content);
                    }else{
                        blogData.content= blogData.content[page-1].content;
                    }
                    data.blogData = blogData;
                    blogSchema.blogDetailView(req.params.id,function(err1){
                        if(err1===null){
                            data.pageUrl = global.config.siteUrl+data.app+'/detail/'+req.params.id+'/';
                            data.pageCount = blogData.pageCount;
                            data.pageNow = page;
                            data.limitPerPage = 1;
                            data.pagerLen = 5;//翻页控件显示页数
                            res.render('blog/detail', data);
                        }else{
                            global.config.resError(req,res,'数据错误');
                        }
                    });
                }else{
                    global.config.resError(req,res,'404','/404');
                }
            }else{
                global.config.resError(req,res,'404','/404');
            }
        });
    }
});
//短连接神马的，最有爱了 >3</
router.get('/article/:shorturl/:page?',function(req,res){
    var page = Number(req.params.page);
    if(req.params.page===undefined || isNaN(page) || page<1){
        page = 1;
    }
    var shortURLPromise = short.retrieve(String(req.params.shorturl)).then(function(result) {
        var data = new renderData();
        if(req.login){
            //记录原链接会员积分
            //还没有写...
            //跳转至本会员的新链接
            var shortURLPromise = short.generate({
                URL : global.config.siteUrl+'blog/detail/'+result.data.blogId+'?userId='+String(req.userData._id),
                data:{
                    blogId:result.data.blogId,
                    userId:String(req.userData._id)
                }
            });
            shortURLPromise.then(function(mongodbDoc) {
                short.retrieve(mongodbDoc.hash).then(function(result) {
                    blogSchema.blogDetail(result.data.blogId,function(err,blogData){
                        if(err===null && blogData!==null && blogData.info && blogData.content){
                            if(blogData.info.state===1 && page<=blogData.content.length){
                                blogData.pageCount = blogData.content.length;//获取分页数量
                                if(blogData.info.format !== 'html' && blogData.content[page-1].content){
                                    blogData.content= markdown.toHTML(blogData.content[page-1].content);
                                }else{
                                    blogData.content= blogData.content[page-1].content;
                                }
                                data.blogData = blogData;
                                /**
                                 * 编辑和修订权限 - 前台显示
                                 * */
                                if(req.userData._id.toString()===blogData.info.author.id){//判断是否为用户自己的文章
                                    data.blogData.isMyArticle = true;
                                }else if(req.userData.permission.blog.revise){//判断是否有修订权限
                                    data.blogData.hasRevisePermission = true;
                                }
                                blogSchema.blogDetailView(result.data.blogId,function(err1){
                                    if(err1===null){
                                        data.pageUrl = global.config.siteUrl+data.app+'/article/'+req.params.shorturl+'/';
                                        data.pageCount = blogData.pageCount;
                                        data.pageNow = page;
                                        data.limitPerPage = 1;
                                        data.pagerLen = 5;//翻页控件显示页数
                                        res.render('blog/detail', data);
                                    }else{
                                        global.config.resError(req,res,'数据错误');
                                    }
                                });
                            }else{
                                global.config.resError(req,res,'404','/404');
                            }
                        }else{
                            global.config.resError(req,res,'404','/404');
                        }
                    });
                },function(error) {
                    if (error) {global.config.resError(req,res,'404','/404');}
                });
            },function(error) {
                if (error) {global.config.resError(req,res,'404','/404');}
            });
        }else{
            blogSchema.blogDetail(result.data.blogId,function(err,blogData){
                if(err===null && blogData.content){
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
                                global.config.resError(req,res,'数据错误');
                            }
                        });
                    }else{
                        global.config.resError(req,res,'404','/404');
                    }
                }else{
                    global.config.resError(req,res,'404','/404');
                }
            });
        }
    },function(error) {
        if (error) {global.config.resError(req,res,'404','/404');}
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
router.use(function(req,res,next){
    if(req.login){
        next();
    }else{
        global.config.resError(req,res,'请登陆。','/user/login');
    }
});

router.get('/getShareUrl/:id',function(req,res){
    var sendErr = function(r,err){
        r.json({
            err:true
        });
    }
    var shortURLPromise = short.generate({
        URL : global.config.siteUrl+'blog/detail/'+req.params.id+'?userId='+String(req.userData._id),
        data:{
            blogId:req.params.id,
            userId:String(req.userData._id)
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
});


/**
 * editor----------------------------------------------------------------------------------
 * api
 * */
router.use(function(req,res,next){
    global.config.checkPermission(req,res,'blog','edit',true,function(hasPermission){
        if(hasPermission){
            next();
        }
    });
});
router.get('/write',function(req,res){
    var rData = new renderData({
        title : 'Moreii团队博客 - 书写日志',
        jsfile: 'blog_admin.js'
    });
    res.render('blog/write', rData);
});

router.get('/edit/:blogId',function(req,res){
    blogSchema.blogDetail(req.params.blogId,function(err,blogData){
        if(err===null){
            var rData = new renderData({
                title : 'Moreii团队博客 - 编辑日志',
                jsfile: 'blog_admin.js',
                blogData:blogData
            });
            var content = '';
            for(var i= 0,len=blogData.content.length;i<len;i++){
                content += blogData.content[i].content;
            }
            rData.blogData.content = content;
            res.render('blog/edit', rData);
        }else{
            res.send(JSON.stringify({
                error:true,
                errorInfo:err
            }));
        }
    });
});

router.post('/api/add',function(req,res){
    var blogData = {
        title:global.xss.text.process(req.body.title),
        content:global.xss.html.process(req.body.content),
        tag:global.xss.text.process(req.body.tag.join(' ')).replace(/^\s+/,'').replace(/\s{2,}/,' ').replace(/\s+$/,'').replace(/\[removed\]/g,'').split(' '),
        format:global.xss.text.process(req.body.format),
        type:global.xss.text.process(req.body.type),
        author:{
            id:req.userData._id,
            name:req.userData.name
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
});

router.post('/api/update/:id',function(req,res){
    /**
     * 判断是否为本人文章
     * */
    blogSchema.blogDetail(req.params.id,function(err1,originalBlogData){
        if(err1===null && originalBlogData!==null){
            if(originalBlogData.info.author.id === req.userData._id.toString()){//本人文章
                var blogData = {
                    title:global.xss.text.process(req.body.title),
                    content:global.xss.html.process(req.body.content),
                    tag:global.xss.text.process(req.body.tag.join(' ')).replace(/^\s+/,'').replace(/\s{2,}/,' ').replace(/\s+$/,'').replace(/\[removed\]/g,'').split(' '),
                    format:global.xss.text.process(req.body.format),
                    type:global.xss.text.process(req.body.type)
                };
                blogSchema.update(req.params.id,blogData,req.userData,function(err2){
                    if(err2===null){
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
            }else if(req.userData.permission.blog.revise===true){//非本人文章，但有修订权限,我不会说这两种情况下代码是暂时一样的...
                var blogData = {
                    title:req.body.title,
                    content:req.body.content,
                    tag:global.xss.text.process(req.body.tag.join(' ')).replace(/^\s+/,'').replace(/\s{2,}/,' ').replace(/\s+$/,'').replace(/\[removed\]/g,'').split(' '),
                    format:global.xss.text.process(req.body.format),
                    type:global.xss.text.process(req.body.type)
                };
                blogSchema.update(req.params.id,blogData,req.userData,function(err,version){
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
                                '您的文章"'+originalBlogData.info.title+'"被"'+req.userData.name+'"修订，版本号：'+ version,
                            'systemInfo',
                                global.config.siteUrl+'blog/detail/'+req.params.id,
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
});
//后台首页

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
                    res.redirect(global.config.siteUrl+'500');
                }
           });
       }else{
           res.redirect(global.config.siteUrl+'500');
       }
    });
});
//统计作者数据
router.get('/console/authors/:page?',function(req,res){
    var page = Number(req.params.page),
        limitPerPage = 10;
    if(isNaN(page) || page<1){
        page=1;
    }
    var data = new renderData({
        title:'博客作者统计',
        jsfile:'blog_admin.js',
        cssfile:'blog_console.css',
        consoleNavActive:'authors'
    });
    blogSchema.statisticAuthor(limitPerPage*(page-1),limitPerPage*page,function(err,authorData){
        if(err===null){
            data.authorData = authorData;
            blogSchema.statisticAuthorNum(function(err1,authorNum){
                if(err1===null){
                    data.pageUrl = global.config.siteUrl+data.app+'/console/authors/';
                    data.pageCount = Math.ceil(authorNum/limitPerPage);
                    data.pageNow = page;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/console/authors',data);
                }else{
                    config.resError(req,res,'数据错误','/500');
                }
            })
        }else{
            config.resError(req,res,'数据错误','/500');
        }
    });
});
//内容管理列表
router.get('/console/bloglist/:page?',function(req,res){
    var page = Number(req.params.page),
        limitPerPage = 10;
    if(isNaN(page) || page<1){
        page=1;
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
                    data.pageUrl = global.config.siteUrl+data.app+'/console/bloglist/';
                    data.pageCount = Math.ceil(countData/limitPerPage);
                    data.pageNow = page;
                    data.limitPerPage = limitPerPage;
                    data.pagerLen = 5;//翻页控件显示页数
                    res.render('blog/console/loglist',data);
                }else{
                    res.redirect(global.config.siteUrl+'500');
                }
            });
        }else{
            res.redirect(global.config.siteUrl+'500');
        }
    });
});
//删除日志

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
router.get('/api/getBlogDetail/:id',function(req,res){
    var forEdit = false;
    if(req.query.forEdit==='true'){
        forEdit = true;
    }
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
    },forEdit);
});
module.exports = router;
