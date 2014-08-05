var express = require('express'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii tool';
    this.cssfile = data.cssfile || 'tool.css';
    this.jsfile = data.jsfile ||'tool.js';
    this.siteUrl = global.config.siteUrl;
    this.app = 'tool';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
}

router.get('/', function(req, res) {
    var data = new renderData({
        title : 'Moreii tool'
    });
    res.render('tool/index', data);
});
router.get('/color', function(req, res) {
    var data = new renderData({
        title : 'Moreii color',
        cssfile:'tool-color.css'
    });
    res.render('tool/color', data);
});
router.get('/area', function(req, res) {
    var data = new renderData({
        title : 'Moreii area'
    });
    res.render('tool/area', data);
});
/*api*/
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
