var express = require('express'),
    fs = require('fs'),
    path=require('path'),
    wineSchema = require('../core/schema/wine');
var router = express.Router();
var renderData = function(data){
    if(data===undefined){
        var data = {};
    }
    this.title = data.title || 'Moreii wine';
    this.cssfile = data.cssfile || 'wine.css';
    this.jsfile = data.jsfile ||'';
    this.siteUrl = global.config.siteUrl;
    this.app = 'wine';
    this.nav = global.config.nav;
    this.apps = global.config.app;
    this.pretty = true;
}
/*
* 判断应用状态
* */
router.use(function(req,res,next){
    if(global.config.app.wine.state===1){
        next();
    }else{
        res.redirect(global.config.siteUrl+'404');
    }
})
/* GET home page. */
router.get('/', function(req, res) {
    var data = new renderData({
        title : '干几瓶',
        jsfile: 'wine_product.js'
    });
    res.render('wine/test',data);
});
router.get('/test', function(req, res) {
    var data = new renderData({
        title : 'Moreii Wine',
        jsfile: 'wine_product.js'
    });
    res.render('wine/test',data);
});
/*
* 统计api
* */
router.get('/api/score',function(req,res){
    res.json({
        test:'test'
    });
})
router.post('/api/score',function(req,res){
    /*res.json({
        test:'test'
    });*/
    var scoreData = req.body.scoreData;
    if(typeof scoreData === 'object' && scoreData.score && scoreData.playTime){
        scoreData.score = Number(scoreData.score);
        scoreData.playTime = Number(scoreData.playTime);
        if(isNaN(scoreData.score) || isNaN(scoreData.playTime)){
            res.json({
                err:true,
                des:'数据错误'
            });
        }else{
            wineSchema.add({
                score:scoreData.score,
                playTime:scoreData.playTime
            },function(err){
                if(err===null){
                    wineSchema.getRank(scoreData.score,function(err1,data){
                           if(err1===null){
                               wineSchema.allCount(function(err2,data1){
                                   if(err2===null){
                                       console.log(data);
                                       console.log(data1);
                                       res.json({
                                           err:false,
                                           rank:Math.round(data/data1*10000)/100
                                       });
                                   }else{
                                       res.json({
                                           err:true,
                                           des:'数据错误'
                                       });
                                   }
                               });
                           }else{
                               res.json({
                                   err:true,
                                   des:'数据错误'
                               });
                           }
                    });
                }else{
                    res.json({
                        err:true,
                        des:'数据错误'
                    });
                }
            });
        }
    }else{
        res.json({
            err:true,
            des:'数据错误'
        });
    }
});

module.exports = router;
