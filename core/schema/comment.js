/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var commentSchema = new mongoose.Schema({
    uid:String,
    touid:Array,
    userData:{
        name:{
            type:'String',
            required:true
        },
        mail:{
            type:'String',
            required:true
        },
        permission:String
    },
    toUserData:Array,
    content:String,
    app:String,
    appPageId:String,
    time:Date
});
var commentModel = db.model('comment',commentSchema);

module.exports = {
    add:function(data,callback){
        console.log(data);
        commentModel.create(data,function(err){
            callback(err);
        })
    },
    list:function(queryData,skip,limit,callback){
        commentModel.find(queryData)
            .skip(skip)
            .limit(limit)
            .sort({'_id':-1})
            .exec(function(err,data){
                callback(err,data);
            });
    },
    del:function(id,callback){
        commentModel.findById(id)
            .exec(function(err,data){
                data.remove(function(err,data){
                    if(callback){
                        callback(err,data);
                    }
                });
            });
    }
}