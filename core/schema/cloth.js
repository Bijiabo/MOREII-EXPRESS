/**
 * Created by boooo on 14-8-2.
 * 定制模块：面料模块
 */
var mongoose = require('mongoose'),
    db = require('../db');
var clothSchema = new mongoose.Schema({
    codeNumber:{type:String,default:'',index:true},
    brand:{type:String,default:'',index:true},
    originPlace:{type:String,default:'',index:true},
    color:{type:String,default:'',index:true},
    pattern:{type:String,default:'',index:true},//图案
    weight:{type:Number,default:250,index:true},//克重
    price:{type:Number,default:0,index:true},
    yarnCount:{type:Number,default:100,index:true},
    description:{type:String,default:'',index:true},//详细介绍
    state:{type:Number,default:1,index:true},//状态：1为正常，0为删除
    picture:{type:Array},//图片队列
    previewPicture:{type:String}//预览图片
});
var clothModel = db.model('cloth',clothSchema);

module.exports = {
    add:function(data,callback){
        var clothData = new clothModel(data);
        clothData.save(callback);
    },
    find:function(find,sort,skip,limit,callback){
        clothModel.find(find)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(callback);
    },
    delete:function(find,callback){
        clothModel.update(find,{"$set":{state:0}},callback);
    },
    shiftDelete:function(find,callback){
        clothModel.remove(find,callback);
    }
}
