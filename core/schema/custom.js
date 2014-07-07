/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var customSchema = new mongoose.Schema({
    uid:String,
    drawData:Object
});
var customModel = db.model('custom',customSchema);

module.exports = {
    add:function(data,callback){
        customModel.create(data,function(err){
            callback(err);
        })
    },
    update:function(_id,data,callback){
        customModel.update({_id:_id},{$set:data},function(err){
            callback(err);
        })
    },
    list:function(queryData,skip,limit,callback){
        customModel.find(queryData)
            .skip(skip)
            .limit(limit)
            .sort({'_id':-1})
            .exec(function(err,data){
                callback(err,data);
            });
    },
    findById:function(id,callback){
        customModel.findById(id)
            .exec(function(err,data){
                callback(err,data);
            });
    }
}