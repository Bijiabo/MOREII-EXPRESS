/**
 * 路由模块：微博
 * Created by boooo on 14-10-9.
 */
var router = global.express.Router(),
    renderData = function(data){
        if(data===undefined){
            data = {};
        }
        this.title = data.title || 'Microblog';
        this.jsfile = data.jsfile ||'';
        this.cssfile = data.cssfile || '';
        this.siteUrl = global.config.siteUrl;
        this.data = data.data||{};
        this.app = 'microblog';
        this.consoleNav = [
            {
                name:'管理首页',
                path:''
            }
        ];
        this.consoleNavActive = data.consoleNavActive || '';
    };
router.get('/',function(req,res){
    var renderdata = new renderData();
    res.render('microblog/index',renderdata);
});
module.exports = router;