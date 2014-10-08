/**
 * Created by boooo on 14-5-17.
 */
var userModal = require('./user');
//var ObjectId = mongoose.Schema.Types.ObjectId;
var classSchema = new global.mongoose.Schema({
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
var studentClassSchema = new global.mongoose.Schema({
    uid:{type:String,index:true},
    name:{type:String,index:true},
    course:[
        {
            classId:String,
            name:String,
            remark:String,
            score:Number
        }
    ],
    classId:{type:String,index:true},
    className:{type:String,index:true},
    state:{ type : String, default: '在校' ,index:true}
});
var teacherClassSchema = new global.mongoose.Schema({
    uid:{type:String,index:true},
    name:{type:String,index:true},
    class:[
        {
            id:{type:String,index:true},
            name:{type:String,index:true}
        }
    ]
});
var studentRemarkClassSchema = new global.mongoose.Schema({
    uid:{type:String,index:true},
    name:{type:String,index:true},
    remark:String,
    state:{ type : String, default: '未读' ,index:true},
    createTime:{ type : Date, default: Date.now }
});
var classModel = global.db.model('class',classSchema),
    studentClassModel = global.db.model('studentclass',studentClassSchema),
    teacherClassModel = global.db.model('teacherclass',teacherClassSchema);

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
        if(find.constructor.toString().match('Array')){
            console.log(find);
            studentClassModel.find()
                .where('uid').in(find)
                .skip(skip)
                .limit(limit)
                .sort({"_id":1})
                .exec(function(err,data){
                    callback(err,data);
                });
        }else{
            studentClassModel.find(find)
                .skip(skip)
                .limit(limit)
                .sort({"_id":1})
                .exec(function(err,data){
                    callback(err,data);
                });
        }
    },
    addUserToStudent:function(userIdArray,callback){
        studentClassModel.find({'uid':{$in:userIdArray}})
            .select('_id uid name')
            .exec(function(err,userData){
                if(err===null){
                    if(userData!==null){//去重，防止重复添加
                        for(var i= 0,dataLens=userData.length;i<dataLens;i++){
                            for(var j= 0,userIdArrayLen=userIdArray.length;j<userIdArrayLen;j++){
                                if(userIdArray[j]==userData[i].uid){
                                    userIdArray.splice(j,1);
                                }
                            }
                        }
                    }
                    userModal.getUserInfoByArray(userIdArray,'_id name',function(err,userDatas){
                        if(err===null){
                            //添加学生数据
                            var studentClassModelArray = [];
                            for(var k= 0,uDataLen = userDatas.length;k<uDataLen;k++){
                                studentClassModelArray.push(new studentClassModel({
                                    uid:userDatas[k]._id.toString(),
                                    name:userDatas[k].name
                                }));
                            }
                            studentClassModel.create(studentClassModelArray,function(err,savedData){
                                callback(err,savedData);
                            });
                        }
                    });

                }else{
                    callback(err);
                }
            });
    },
    removeUserToStudent:function(userIdArray,callback){
        studentClassModel.remove({'uid':{$in:userIdArray}})
            .exec(function(err,removedData){
                callback(err,removedData);
            });
    },
    findTeacher:function(find,skip,limit,callback){//查找教师
        teacherClassModel.find(find)
            .sort({'_id':1})
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    addTeacher:function(userIdArray,callback){//添加教师
        teacherClassModel.find({'uid':{$in:userIdArray}})
            .select('_id uid name')
            .exec(function(err,userData){
                if(err===null){
                    if(userData!==null){//去重，防止重复添加
                        for(var i= 0,dataLens=userData.length;i<dataLens;i++){
                            for(var j= 0,userIdArrayLen=userIdArray.length;j<userIdArrayLen;j++){
                                if(userIdArray[j]==userData[i].uid){
                                    userIdArray.splice(j,1);
                                }
                            }
                        }
                    }
                    userModal.getUserInfoByArray(userIdArray,'_id name',function(err,userDatas){
                        if(err===null){
                            //添加学生数据
                            var teacherClassModelArray = [];
                            for(var k= 0,uDataLen = userDatas.length;k<uDataLen;k++){
                                teacherClassModelArray.push(new studentClassModel({
                                    uid:userDatas[k]._id.toString(),
                                    name:userDatas[k].name
                                }));
                            }
                            teacherClassModel.create(teacherClassModelArray,function(err,savedData){
                                callback(err,savedData);
                            });
                        }
                    });

                }else{
                    callback(err);
                }
            });
    },
    removeTeacher:function(userIdArray,callback){//删除教师
        teacherClassModel.remove({'uid':{$in:userIdArray}})
            .exec(function(err,removedData){
                callback(err,removedData);
            });
    }
}