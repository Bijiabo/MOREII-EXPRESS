/**
 * Created by boooo on 14-5-24.
 */
var express = require('express'),
    router = express.Router(),
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
    this.siteUrl = global.config.siteUrl;
    this.customData = data.customData ||{};
    this.app = 'custom';
    this.nav = global.config.nav;
    this.apps = global.config.app;
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
            res.redirect(global.config.siteUrl+'404');
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
            res.redirect(global.config.siteUrl+'404');
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
            res.redirect(global.config.siteUrl+'404');
        }
    });
});

/**
 * for logined users
 * */

router.use(function(req,res,next){
    if(req.login){
        next();
    }else{
        res.redirect('/user/login');
    }
});

router.get('/api/listCustom', function(req, res) {
    customSchema.list({uid:req.userData._id},0,20,function(error,data){
        res.json({err:error,data:data});
    });
});
router.post('/api/addCustom', function(req, res) {
    customSchema.add({
        uid:req.userData._id,
        drawData:req.body.drawData
    },function(error,data){
        res.json({err:error});
    });
});

module.exports = router;