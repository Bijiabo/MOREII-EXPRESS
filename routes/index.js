var express = require('express'),
    config = require('../core/config'),
    router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || config.siteName;
    this.jsfile = data.jsfile || '';
    this.siteUrl = config.siteUrl;
    this.app = 'index';
    this.nav = config.nav;
    this.apps = config.app;
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData();
    res.render('index', data);
});
router.get('/console', function(req, res) {
    var data = new renderData();
    res.render('index', data);
});
module.exports = router;
