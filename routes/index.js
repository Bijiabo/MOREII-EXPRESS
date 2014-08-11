var express = require('express'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || global.config.siteName;
    this.jsfile = data.jsfile || '';
    this.siteUrl = global.config.siteUrl;
    this.app = 'index';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData();
    /*res.json({
        appStack:app._router.stack
    });*/
    res.render('index', data);
});
router.get('/console', function(req, res) {
    var data = new renderData();
    res.render('index', data);
});
app.get('/500',function(req,res){
    res.status(500);
    var data = new renderData({
        title:'500'
    });
    res.render('500',data);
});
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
