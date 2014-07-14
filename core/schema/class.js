/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var classSchema = new mongoose.Schema({
    name:String,
    intro:String,
    studentsCount:Number,
    createTime:Date,
    startTime:Date,
    endTime:Date
});
var classModel = db.model('class',classSchema);

module.exports = {
    add:function(data,callback){
        var classData = new classModel(data);
        classData.save(function(err,classDataSaved){
            callback(err,classDataSaved);
        });
    },
    list:function(find,skip,limit,callback){
        classModel.find(find)
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    getClassInfoById:function(id,callback){
        classModel.findById(id,function(err,classData){
            callback(err,classData);
        });
    }
}