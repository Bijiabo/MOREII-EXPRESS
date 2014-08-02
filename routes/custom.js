/**
 * Created by boooo on 14-5-24.
 */
var express = require('express'),
    router = express.Router(),
    config = require('../core/config'),
    fs = require('fs'),
    rd = require('rd'),//read-dir -> node-rd
    path = require('path'),
    userSchema = require('../core/schema/user'),
    customSchema = require('../core/schema/custom');
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii Blog';
    this.jsfile = data.jsfile ||'slick.min.js';
    this.cssfile = data.cssfile || '';
    this.siteUrl = config.siteUrl;
    this.customData = data.customData ||{};
    this.app = 'custom';
    this.nav = config.nav;
    this.apps = config.app;
    this.pretty = true;
}
/* GET users listing. */
router.get('/', function(req, res) {
    fs.readdir(path.join(__dirname,'../public/img/custom'),function(err,fileList){
        if(err===null){
            console.log(fileList);
            var data = new renderData({
                title : 'Moreii Custom',
                cssfile: 'shop.css',
                jsfile: 'slick.min.js,custom_index.js',
                customData:{
                    styleArray:fileList,
                    styleCount:fileList.length
                }
            });
            res.render('custom/index',data);
        }else{
            res.redirect(config.siteUrl+'404');
        }
    });
});
router.get('/make/:style', function(req, res) {
    fs.readdir(path.join(__dirname,'../public/img/custom/'+req.params.style),function(err,fileList){
        console.log(fileList);
        if(err===null){
            var data = new renderData({
                title : 'Moreii Custom Make',
                jsfile: 'slick.min.js,html2canvas.min.js,custom_make.js',
                customData:{
                    style:req.params.style,
                    elementCount:fileList.length,
                    elmentArray:fileList
                }
            });
            res.render('custom/make',data);
        }else{
            res.redirect(config.siteUrl+'404');
        }
    });
});
router.get('/make/chair/:style', function(req, res) {
    fs.readdir(path.join(__dirname,'../public/img/custom/'+req.params.style),function(err,fileList){
        console.log(fileList);
        if(err===null){
            var data = new renderData({
                title : 'Moreii Custom Make',
                jsfile: 'slick.min.js,html2canvas.min.js,custom_makechair.js',
                cssfile:'customchair.css',
                customData:{
                    style:req.params.style,
                    elementCount:fileList.length,
                    elmentArray:fileList
                }
            });
            res.render('custom/makechair',data);
        }else{
            res.redirect(config.siteUrl+'404');
        }
    });
});

/**
 * for logined users
 * */

router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            res.redirect('/user/login');
        }
    });
});

router.get('/api/listCustom', function(req, res) {
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            customSchema.list({uid:userData._id},0,20,function(error,data){
                res.send(JSON.stringify({err:error,data:data}));
            });
        }else{
            res.send(JSON.stringify({err:err}));
        }
    });
});
router.post('/api/addCustom', function(req, res) {
    userSchema.getUserInfo({
        name:req.cookies.name,
        mail:req.cookies.mail
    },function(err,userData){
        if(err===null){
            customSchema.add({
                uid:userData._id,
                drawData:req.body.drawData
            },function(error,data){
                res.send(JSON.stringify({err:error}));
            });
        }else{
            res.send(JSON.stringify({err:err}));
        }
    });
});

module.exports = router;