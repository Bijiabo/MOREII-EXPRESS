/**
 * Created by boooo on 14-8-2.
 */
var mongoose = require('mongoose'),
    config = require('../config'),
    db = require('../db');
var siteSchema = new mongoose.Schema({
    siteName:{type:String,default:config.siteName,index:true},
    domain:{type:String,default:config.domain,index:true},
    siteUrl:{type:String,default:config.siteUrl,index:true},
    logo:{type:String,default:config.logo},
    app:{type:Array,default:config.app}
});
var siteModel = db.model('sites',siteSchema);

/*
* init/refresh site configure function
* */
var refreshSiteConfigure = function(){
    siteModel.findOne().exec(function(err,data){
        if(err===null && data===null){
            var siteData = new siteModel({
                siteName:config.siteName
            });
            siteData.save(function(err,savedData){
                if(err===null){
                    console.log('>>>>>> init site configure data successed!');
                }else{
                    console.log('>>>>>> init site configure data failed:');
                    console.log(err);
                }
            });
        }else{
            config.siteName = data.siteName;
            config.domain = data.domain;
            config.siteUrl = data.siteUrl;
            config.logo = data.logo;
            config.app = data.app;
            console.log('>>>>>> recover site configure data successed!');
        }
    });
}();

module.exports = {
    refreshSiteConfigure:refreshSiteConfigure
}
