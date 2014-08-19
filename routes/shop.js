/**
 * Created by boooo on 14-5-26.
 */
var express = require('express'),
    shopSchema = require('../core/schema/shop'),
    orderSchema = require('../core/schema/order');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii store';
    this.jsfile = data.jsfile ||'shop.js';
    this.cssfile = data.cssfile || 'shop.css';
    this.siteUrl = global.config.siteUrl;
    this.app = 'shop';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
}
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData();
    res.render('shop/index', data);
});
router.get('/list', function(req, res) {
    var data = new renderData();
    shopSchema.listGood({},0,20,function(err,goodData){
        if(err===null){
            data.goodData = goodData;
        }else{
            data.goodData = null;
        }
        res.render('shop/list', data);
    });
});
router.get('/detail/:query', function(req, res) {
    var goodId = req.params.query;
    var data = new renderData();
    shopSchema.goodDetail(goodId,function(err,goodData){
        if(err===null){
            data.goodData = goodData;
        }else{
            data.goodData = null;
        }
        res.render('shop/detail', data);
    });
});

/**
 * public api
 * */
router.get('/api/goodDetail/:query', function(req, res) {
    var goodId = req.params.query;
    shopSchema.goodDetail(goodId,function(err,data){
        res.send(JSON.stringify({
            err:err,
            data:data
        }));
    });
});

/*api*/
/**
 * 普通用户API
 * */
router.use(function(req,res,next){
    userSchema.checkLogin(req,res,function(login){
        if(login){
            next();
        }else{
            res.send(JSON.stringify({
                err:true,
                description:"亲你木有登陆呀！请登录好么..."
            }));
        }
    });
});

router.post('/api/addOrder',function(req,res){
    var orderData = {
        uid:'',
        goodId:req.body.goodID,
        goodData:{},
        price:0,
        count:Number(req.body.count),
        address:{},
        phoneNumber:'',
        remark:req.body.remark,
        state:'waitingPaid'
    }

    orderData.uid = req.userData._id;
    shopSchema.goodDetail(req.body.goodID,function(err,goodData){
        if(err===null){
            orderData.goodData = goodData;
            orderData.price = goodData.price * Number(req.body.count);
        }else{
            res.send(JSON.stringify({
                err:err,
                data:data
            }));
        }
    });

});


module.exports = router;
