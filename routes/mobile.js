var express = require('express'),
    config = require('../core/config'),
    fs = require('fs'),
    path=require('path'),
    userSchema = require('../core/schema/user');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii mobile';
    this.cssfile = data.cssfile || 'mobile.css';
    this.jsfile = data.jsfile ||'mobile.js';
    this.siteUrl = config.siteUrl;
    this.app = 'mobile';
    this.nav = config.nav;
    this.apps = config.app;
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData({
        title : 'Moreii mobile'
    });
    res.render('mobile/index', data);
});
router.get('/v', function(req, res) {
    var data = new renderData({
        title : 'Moreii Video',
        cssfile : 'mobile_video.css',
        jsfile: 'mobile_video.js'
    });
    res.render('mobile/video', data);
});
router.get('/manifest', function(req, res) {
    fs.readFile(path.join(__dirname, '../public/mobile.manifest'),function(err,data){
        if(err===null){
            res.set('Content-Type',  'text/cache-manifest manifest').send(data);
        }else{
            res.send(JSON.stringify({
                err:err,
                data:data
            }));
        }
    });
});
/*api for administrator*/
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
