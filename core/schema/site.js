/**
 * Created by boooo on 14-8-2.
 */
var mongoose = require('mongoose');
var siteSchema = new mongoose.Schema({
    siteName:{type:String,default:global.config.siteName,index:true},
    domain:{type:String,default:global.config.domain,index:true},
    port:{type:Number,default:global.config.port,index:true},
    siteUrl:{type:String,default:global.config.siteUrl,index:true},
    logo:{type:String,default:global.config.logo},
    version:{type:String,default:global.config.version},
    nav:{type:Array,default:global.config.nav},
    app:{type:Object,default:global.config.app},
    logoImage:{type:String},
    logoImageResize:{type:String},
    footerInfo:{type:mongoose.Schema.Types.Mixed}
});
var siteModel = global.db.model('sites',siteSchema);

/*
* init/refresh site configure function
* 初始化站点配置
* */
var recoverFromConfig = function(callback){
        var cb = callback || function(){};
        var siteData = new siteModel({
            siteName:global.config.siteName
        });
        siteData.save(function(err,savedData){
            if(err===null){
                console.log('>>>>>> init site configure data successed!');
            }else{
                console.log('>>>>>> init site configure data failed:');
                console.log(err);
            }
            cb(err,savedData);
        });
    },
    refreshSiteConfigure = function(callback){
    var cb = callback || function(){};
    siteModel.findOne().sort({"_id":-1}).exec(function(err,data){
        if(err===null && data===null){
            recoverFromConfig(callback);
        }else{
            global.config.siteName = data.siteName;
            global.config.domain = data.domain;
            global.config.port = data.port;
            global.config.siteUrl = data.siteUrl;
            global.config.logo = data.logo;
            global.config.app = data.app;
            global.config.nav = data.nav;
            global.config.logoImage = data.logoImage;
            global.config.logoImageResize = data.logoImageResize;
            global.config.footerInfo = data.footerInfo;
            console.log('>>>>>> recover site configure data successed!');
            cb(err,data);
        }
    });
};
refreshSiteConfigure();

module.exports = {
    recoverFromConfig:recoverFromConfig,
    refreshSiteConfigure:refreshSiteConfigure,
    getLatestInfo:function(callback){
        siteModel.findOne().sort({"_id":-1}).exec(function(err,data){
            callback(err,data);
        });
    },
    update:function(data,callback){
        siteModel.findOne().sort({"_id":-1}).exec(function(err,odata){
            if(err===null && data!==null){
                odata.siteName = data.siteName;
                odata.domain = data.domain;
                odata.port = data.port;
                odata.logo = data.logo;
                odata.app = data.app;
                odata.logoImage = data.logoImage;
                odata.logoImageResize = data.logoImageResize;
                odata.footerInfo = data.footerInfo;
                odata.save(function(err1,savedData){
                    if(err1===null){
                        refreshSiteConfigure(callback);
                    }else{
                        callback(err1,savedData);
                    }
                });
            }else{
                var siteData = new siteModel(data);
                siteData.save(function(err,savedData){
                    if(err===null){
                        refreshSiteConfigure(callback);
                    }else{
                        callback(err,savedData);
                    }
                });
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
