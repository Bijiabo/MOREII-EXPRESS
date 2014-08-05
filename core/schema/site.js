/**
 * Created by boooo on 14-8-2.
 */
var mongoose = require('mongoose'),
    config = require('../config'),
    db = require('../db');
var siteSchema = new mongoose.Schema({
    siteName:{type:String,default:config.siteName,index:true},
    domain:{type:String,default:config.domain,index:true},
    port:{type:Number,default:config.port,index:true},
    siteUrl:{type:String,default:config.siteUrl,index:true},
    logo:{type:String,default:config.logo},
    version:{type:String,default:config.version},
    nav:{type:Array,default:config.nav},
    app:{type:Object,default:config.app}
});
var siteModel = db.model('sites',siteSchema);

/*
* init/refresh site configure function
* 初始化站点配置
* */
var refreshSiteConfigure = function(callback){
    var cb = callback || function(){};
    siteModel.findOne().sort({"_id":-1}).exec(function(err,data){
        if(err===null && data===null){
            var siteData = new siteModel({
                siteName:config.siteName
            });
            siteData.save(function(err1,savedData){
                if(err1===null){
                    console.log('>>>>>> init site configure data successed!');
                }else{
                    console.log('>>>>>> init site configure data failed:');
                    console.log(err1);
                }
                cb(err1,data);
            });
        }else{
            config.siteName = data.siteName;
            config.domain = data.domain;
            config.port = data.port;
            config.siteUrl = data.siteUrl;
            config.logo = data.logo;
            config.app = data.app;
            config.nav = data.nav;
            console.log('>>>>>> recover site configure data successed!');
            cb(err,data);
        }
    });
};
refreshSiteConfigure();

module.exports = {
    refreshSiteConfigure:refreshSiteConfigure,
    getLatestInfo:function(callback){
        siteModel.findOne().sort({"_id":-1}).exec(function(err,data){
            callback(err,data);
        });
    },
    update:function(data,callback){
        var siteData = new siteModel(data);
        siteData.save(function(err,savedData){
            if(err===null){
                refreshSiteConfigure(callback);
            }else{
                callback(err,savedData);
            }
        });
    },
    updateNav:function(navArray,callback){
        siteModel.findOne().sort({"_id":-1}).exec(function(err,data){
            if(err===null){
                data.nav = navArray;
                data.save(function(err1,savedData){
                    callback(err1,savedData);
                })
            }else{
                callback(err,data);
            }
        });
    }
}
