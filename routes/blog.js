var express = require('express'),
    config = require('../core/config'),
    userSchema = require('../core/schema/user'),
    blogSchema = require('../core/schema/blog'),
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
    this.pretty = true;
    };
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData({
        title : 'Moreii团队博客'
    });
    blogSchema.listBlog({},0,10,function(err,blogData){
        if(err===null){
            for(var i=0;i<blogData.length;i++){
                blogData[i].content = markdown.toHTML(String(blogData[i].content));
            }
            data.blogData = blogData;
            res.render('blog/index', data);
        }else{
            res.render('blog/index', data);
        }
    });
});
router.get('/detail/:id/:page?', function(req, res) {
    var page = Number(req.params.page);
    if(req.params.page===undefined || isNaN(page)){
        page = 0;
    }
    userSchema.checkLogin(req,res,function(login){
        if(login){
            userSchema.getUserInfo({
                name:req.cookies.name,
                mail:req.cookies.mail
            },function(err,userData){
                if(err===null){
                    var sendErr = function(r,err){
                        r.send(JSON.stringify({
                            err:true
                        }));
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
//            process.exit(0);
                            res.redirect(config.siteUrl+'blog/article/'+result.hash);
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
                    res.send(JSON.stringify({
                        error:true,
                        des:'请登录啊亲'
                    }));
                }
            });
        }else{
            var data = new renderData();
            blogSchema.blogDetail(req.params.id,function(err,blogData){
                if(err===null){
                    console.log(blogData);
                    if(page<blogData.content.length){
                        if(page<blogData.content.length-1){
                            blogData.hasMoreContent = true;
                            blogData.nextPage = config.siteUrl+data.app+'/detail/'+req.params.id+'/'+(page+1);
                        }else{
                            blogData.hasMoreContent = false;
                        }
                        blogData.content= markdown.toHTML(blogData.content[page].content);
                        data.blogData = blogData;
                        res.render('blog/detail', data);
                    }else{
                        res.render('404',{
                            title:'404错误',
                            path:'/blog'+req.path,
                            errorname:'404'
                        });
                    }
                }else{
                    res.render('404',{
                        title:'404错误',
                        path:'/blog'+req.path,
                        errorname:'404'
                    });
                }
            });
        }
    })
});
router.get('/article/:shorturl/:page?',function(req,res){
    var page = Number(req.params.page);
    if(req.params.page===undefined || isNaN(page)){
        page = 0;
    }
    var sendErr = function(r,err){
        r.send(JSON.stringify({
            err:true
        }));
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
                                if(result.hash!==req.params.shorturl){
                                    res.redirect(config.siteUrl+'blog/article/'+result.hash);
                                }else{
                                    blogSchema.blogDetail(result.data.blogId,function(err,blogData){
                                        if(err===null){
                                            if(page<blogData.content.length){
                                                if(page<blogData.content.length-1){
                                                    blogData.hasMoreContent = true;
                                                    blogData.nextPage = config.siteUrl+data.app+'/article/'+req.params.shorturl+'/'+(page+1);
                                                }else{
                                                    blogData.hasMoreContent = false;
                                                }
                                                blogData.content= markdown.toHTML(blogData.content[page].content);
                                                data.blogData = blogData;
                                                /**
                                                * 编辑和修订权限 - 前台显示
                                                * */
                                                if(userData._id.toString()===blogData.info.user.id){//判断是否为用户自己的文章
                                                    data.blogData.isMyArticle = true;
                                                }else if(userData.permission.blog.revise){//判断是否有修订权限
                                                    data.blogData.hasRevisePermission = true;
                                                }
                                                res.render('blog/detail', data);
                                            }else{
                                                res.render('404',{
                                                    title:'404错误',
                                                    path:'/blog'+req.path,
                                                    errorname:'404'
                                                });
                                            }
                                        }else{
                                            res.render('404',{
                                                title:'404错误',
                                                path:'/blog'+req.path,
                                                errorname:'404'
                                            });
                                        }
                                    });
                                }
                            }, function(error) {
                                if (error) {
//                                    throw new Error(error);
                                    sendErr(res);
                                }
                            });
                        }, function(error) {
                            if (error) {
//                                throw new Error(error);
                                sendErr(res);
                            }
                        });
                    }else{
                        sendErr(res);
                    }
                });
            }else{
                blogSchema.blogDetail(result.data.blogId,function(err,blogData){
                    if(err===null){
                        if(page<blogData.content.length){
                            if(page<blogData.content.length-1){
                                blogData.hasMoreContent = true;
                                blogData.nextPage = config.siteUrl+data.app+'/article/'+req.params.shorturl+'/'+(page+1);
                            }else{
                                blogData.hasMoreContent = false;
                            }
                            blogData.content= markdown.toHTML(blogData.content[page].content);
                            data.blogData = blogData;
                            res.render('blog/detail', data);
                        }else{
                            res.render('404',{
                                title:'404错误',
                                path:'/blog'+req.path,
                                errorname:'404'
                            });
                        }
                    }else{
                        res.render('404',{
                            title:'404错误',
                            path:'/blog'+req.path,
                            errorname:'404'
                        });
                    }
                });
            }
        });
    },function(error) {
        if (error) {
//          throw new Error(error);
            sendErr(res);
        }
    });
});


/**
 * 已登陆用户功能
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            if(req.query.ajax === 'true'){
                res.send(JSON.stringify({
                    err:true,
                    des:'请登陆啊亲>_<'
                }));
            }else{
                res.redirect('/user/login');
            }
        }
    });
});


router.get('/getShareUrl/:id',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var sendErr = function(r,err){
                r.send(JSON.stringify({
                    err:true
                }));
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
            res.send(JSON.stringify({
                error:true,
                des:'请登录啊亲'
            }));
        }
    });
});


/**
 * editor----------------------------------------------------------------------------------
 * api
 * */
router.use(function(req,res,next){
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
        console.log(blogData);
        if(err===null){
            var rData = new renderData({
                title : 'Moreii团队博客 - 编辑日志',
                jsfile: 'blog_admin.js',
                blogData : blogData
            });
            res.render('blog/write', rData);
        }else{
            res.send(JSON.stringify({
                error:true,
                errorInfo:err
            }));
        }
    });
});
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
                user:{
                    id:userData._id,
                    name:userData.name
                },
                count:{
                    digg:0,
                    view:0
                },
                time:new Date()
            };
            blogSchema.add(blogData,function(err){
                if(err===null){
                    res.send(JSON.stringify({
                        error:false
                    }));
                }else{
                    res.send(JSON.stringify({
                        error:true,
                        errorInfo:err
                    }));
                }
            });
        }else{
            res.send(JSON.stringify({
                error:true,
                errorInfo:err
            }));
        }
    });
});
router.post('/api/update/:id',function(req,res){
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            var blogData = {
                title:req.body.title,
                content:req.body.content,
                tag:req.body.tag
            };
            blogSchema.update(req.params.id,blogData,function(err){
                if(err===null){
                    res.send(JSON.stringify({
                        error:false
                    }));
                }else{
                    res.send(JSON.stringify({
                        error:true,
                        errorInfo:err
                    }));
                }
            });
        }else{
            res.send(JSON.stringify({
                error:true,
                errorInfo:err
            }));
        }
    });
});
//内容管理列表
router.get('/console/bloglist/:page?',function(req,res){
    blogSchema.listBlog({},0,20,function(err,blogData){
        var data = new renderData({
            title:'blog console list'
        });
        data.blogData = blogData;
        res.render('blog/console/edit',data);
    });
});

module.exports = router;
