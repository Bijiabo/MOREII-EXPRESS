/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var noticeSchema = new mongoose.Schema({
        uid:{
            type:'String',
            required:true
        },
        content:{
            type:'String',
            required:true
        },
        type:{
            type:'String',
            required:true
        },
        read:Boolean,
        link:String
    });
var noticeModel = db.model('notice',noticeSchema);

module.exports = {
    unreadNotice:function(userData,callback){
        noticeModel.find(userData)
            .limit(20)
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
        })
    }
}