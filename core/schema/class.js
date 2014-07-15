/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var classSchema = new mongoose.Schema({
    name:String,
    intro:String,
    students:[
        {
            uid:String,
            name:String,
            remark:String,
            score:Number
        }
    ],
    createTime:{ type : Date, default: Date.now },
    startTime:Date,
    endTime:Date
});
var studentClassSchema = new mongoose.Schema({
    uid:{type:String,index:true},
    course:[
        {
            classId:String,
            name:String,
            remark:String,
            score:Number
        }
    ],
    state:{ type : String, default: '在校' ,index:true}
});
var classModel = db.model('class',classSchema),
    studentClassModel = db.model('studentclass',studentClassSchema);

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
            .sort({"_id":1})
            .exec(function(err,data){
                callback(err,data);
            });
    },
    getClassInfoById:function(id,callback){
        classModel.findById(id,function(err,classData){
            callback(err,classData);
        });
    },
    modifyById:function(id,data,callback){
        classModel.findById(id,function(err,classData){
            if(err===null && classData!==null){
                classData.name = data.name;
                classData.intro= data.intro;
                classData.startTime = data.startTime;
                classData.endTime = data.endTime;
                classData.save(function(err,savedData){
                    callback(err,savedData);
                })
            }else{
                callback(err);
            }
        });
    },
    listStudents:function(find,skip,limit,callback){
        studentClassModel.find(find)
            .skip(skip)
            .limit(limit)
            .sort({"_id":1})
            .exec(function(err,data){
                callback(err,data);
            });
    }
}