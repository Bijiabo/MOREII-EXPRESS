var express = require('express'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || global.config.siteName;
    this.jsfile = data.jsfile || '';
    this.cssfile = data.cssfile || 'index.css';
    this.siteUrl = global.config.siteUrl;
    this.app = 'index';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.consoleNav = [
        {
            name:'内容设置',
            path:''
        }
    ];
    this.consoleNavActive = data.consoleNavActive || '';
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData();
    /*res.json({
        appStack:app._router.stack
    });*/
    res.render('index/index', data);
});
app.get('/500',function(req,res){
    res.status(500);
    var data = new renderData({
        title:'500'
    });
    res.render('500',data);
});
/*
* 后台
* */
router.use('/console/*', function(req,res,next){
    global.config.checkPermission(req,res,'index','edit',true,function(hasPermission){
        if(hasPermission){
            next();
        }
    });
});
router.get('/console', function(req, res) {
    var data = new renderData({
        jsfile:'index_console.js',
        cssfile:'index_console.css'
    });
    res.render('index/console/index', data);
});



/*
* 路由测试功能
* */
/*router.get('/stack', function(req, res) {
    console.log(router.stack);
    res.json({
        stack : router.stack
    });
});
router.get('/reset', function (req, res) {
    var router_stack = router.stack.concat([]);
    router.stack.length = 0;
    router_stack.forEach(function (item) {
        if (item.route.path !== '/') {
            router.stack.push(item);
        }
    });
    res.json({
        stack : router.stack
    });
});*/

module.exports = router;
