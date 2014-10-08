/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose');
var noticeSchema = new mongoose.Schema({
        uid:{
            type:'String',
            required:true,
            index:true
        },
        name:{
            type:'String',
            index:true
        },
        app:{type:String,index:true},
        info:{},
        content:{
            type:'String',
            required:true
        },
        type:{
            type:'String',
            required:true,
            index:true
        },
        read:{type:Boolean,default:false,index:true},
        link:String,
        createTime:{ type : Date, default: Date.now }
    });
var noticeModel = global.db.model('notice',noticeSchema);

module.exports = {
    unreadNotice:function(userData,callback){
        noticeModel.find(userData)
            .sort({'_id':-1})
            .limit(20)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    getList:function(userData,skip,limit,callback){
        noticeModel.find(userData)
            .sort({'_id':-1})
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    addTestNotice:function(uid,callback){
        var testNotice = new noticeModel({
            uid:String(uid),
            content:'this is test notice ' + new Date(),
            type:'test',
            read:false
        });
        testNotice.save(function(err){
            callback(err);
        });
    },
    send:function(uid,name,app,info,content,type,link,callback){
        var notice = new noticeModel({
            uid:uid,
            name:name,
            app:app,
            info:info,
            content:content,
            type:type,
            link:link
        });
        notice.save(function(err,data){
            callback(err,data);
        });
    }
}