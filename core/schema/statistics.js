/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var statisticsSchema = new mongoose.Schema({
        url:{
            type:String,
            required:true,
            index:true
        },
        ip:{
            type:String,
            required:true,
            index:true
        },
        loadingTime:{//页面加载时间 毫秒
            type : Number, default: 0,index:true

        },
        openTime:{//打开时刻
            type : Date, default: Date.now
        },
        browser:{
            name:{
                type:String,
                index:true
            },
            major:{
                type:String,
                index:true
            },
            version:String
        },
        engine:{
            name:{
                type:String,
                index:true
            },
            version:String
        },
        os:{
            name:{
                type:String,
                index:true
            },
            version:String
        },
        device:{
            name:{
                type:String,
                index:true
            },
            version:String
        },
        cpu:{
            architecture:{
                type:String,
                index:true
            }
        },
        ua:{
            type:String
        },
        app:{
            type:String,
            index:true
        },
        path:{
            type:String,
            index:true
        },
        uid:{
            type:String,
            default:'',
            index:true
        },
        uname:{
            type:String,
            default:''
        }
    });
var statisticsModel = db.model('statistic',statisticsSchema);

module.exports = {
    add:function(data,callback){
        var statisticsData = new statisticsModel(data);
        statisticsData.save(function(err,savedData){
            callback(err,savedData);
        });
    },
    updateOpenTime:function(id,time,callback){
        statisticsModel.findByIdAndUpdate(id,{$set:{viewTime:time}},function(err,data){
            callback(err,data);
        });
    },
    todayViewCount:function(callback){
        var t = new Date();
        t = new Date(t.getFullYear()+'-'+ (t.getMonth()+1)+'-'+ t.getDate());
        statisticsModel.find({openTime:{$gt:t}})
            .count()
            .exec(function(err,data){
                callback(err,data);
            });
    },
    todayView:function(callback){
        var t = new Date();
        t = new Date(t.getFullYear()+'-'+ (t.getMonth()+1)+'-'+ t.getDate());
        statisticsModel.find({openTime:{$gt:t}})
            .sort({'_id':-1})
            .exec(function(err,data){
                callback(err,data);
            });
    },
    find:function(find,select,sort,skip,limit,callback){
        statisticsModel.find(find)
            .select(select)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    getPerLoadingTime:function(callback){
        statisticsModel.aggregate(
            {"$group":
                {
                    "_id":"$app",
                    "perLoadingTime":{"$avg":"$loadingTime"}
                }
            }).exec(function(err,data){
                callback(err,data);
            });
    },
    //统计月份内应用浏览量
    statisticBlogViewByMonth:function(year,month,callback){
        statisticsModel.aggregate(
            {
                "$match":{
                    "openTime":{"$gt":new Date(year+'/'+month+'/01'),"$lt":new Date(year+'/'+(month+1)+'/01')},
                    "app":"blog"
                }
            },
            {
                "$project":{
                    "loadingTime":1,
                    "openTime":1,
                    "time":{"$dayOfMonth":"$openTime"}
                }
            },
            {
                "$group":{
                    "_id":"$time",
                    "count":{"$sum":1}
                }
            }
        ).exec(function(err,data){
                callback(err,data);
            });
    }
}