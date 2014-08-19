var express = require('express'),
    userSchema = require('../core/schema/user'),
    commentSchema = require('../core/schema/comment');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii comment';
    this.cssfile = data.cssfile || 'comment.css';
    this.jsfile = data.jsfile ||'comment.js';
    this.siteUrl = global.config.siteUrl;
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.app = 'comment';
    this.pretty = true;
}

router.get('/', function(req, res) {
    var data = new renderData();
    res.render('comment/index', data);
});

/**
 * public api
 * */

router.get('/api/list/:app/:appPageId/:skip/:limit', function(req, res) {
    commentSchema.list({
        app:req.params.app,
        appPageId:req.params.appPageId
    },req.params.skip,req.params.limit,function(err,data){
       res.send(JSON.stringify({
           err:err,
           data:data
       }));
    });
});

/**
 * user api
 * */
router.use(function(req,res,next){
    if(req.login){
        next();
    }else{
        res.json({
            err:true,
            description:'先登陆再评论啊亲！'
        });
    }
});
router.post('/api/add',function(req,res){
    var commenrData = {
        content:req.body.content,
        app:req.body.app,
        appPageId:req.body.appPageId,
        time:new Date()
    };
    commenrData.uid = req.userData._id;
    commenrData.userData = {
        name:req.userData.name,
        mail:req.userData.mail,
        permission:req.userData.permission
    };
    commentSchema.add(commenrData,function(err,data){
        res.send(JSON.stringify({
            err:err,
            data:data
        }));
    })
});



/**
 * administrator api
 * */

router.use(function(req,res,next){
    userSchema.isAdmin(req,function(admin){
        if(admin){
            next();
        }else{
            res.render('404',{
                title:'404错误',
                path:'/mobile'+req.path,
                errorname:'404'
            });
        }
    });
});

module.exports = router;
