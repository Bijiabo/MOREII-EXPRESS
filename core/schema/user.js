/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto');
var userSchema = new mongoose.Schema({
        name:{
            type:'String',
            required:true,
            index:true
        },
        mail:{
            type:'String',
            required:true,
            index:true
        },
        password:{
            type:'String',
            required:true
        },
        phone:String,
        address:Array,
        type:{//账户类型，用于判断多账户登陆情况
            type:String,
            default:'moreii',
            index:true
        },
        url:{//个人主页
            type:String,
            default:''
        },
        state:{//账户状态，1为允许登陆，0为禁止登陆
            type:Number,
            default:1,
            index:true
        },
        permission:{
            index:{
                edit:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            },
            user:{
                login:{type:Boolean,default:true},
                editAddress:{type:Boolean,default:true},
                changeName:{type:Boolean,default:true},
                changeMail:{type:Boolean,default:true},
                changePassword:{type:Boolean,default:true},
                editUser:{type:Boolean,default:true},
                upload:{type:Boolean,default:true}
            },
            message:{
                read:{type:Boolean,default:true},
                send:{type:Boolean,default:true},
                remove:{type:Boolean,default:true},
                upload:{type:Boolean,default:true}
            },
            shop:{
                buy:{type:Boolean,default:true},
                comment:{type:Boolean,default:true},
                editGood:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            },
            class:{
                read:Boolean,
                add:Boolean,
                editClass:{type:Boolean,default:false},
                editStudent:{type:Boolean,default:false},
                editTeacher:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            },
            blog:{
                write:{type:Boolean,default:false},
                comment:{type:Boolean,default:true},
                edit:{type:Boolean,default:false},
                revise:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            },
            statistics:{
                view:{type:Boolean,default:false},
                memberInfo:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            },
            console:{
                edit:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            },
            cloth:{
                edit:{type:Boolean,default:false},
                upload:{type:Boolean,default:false}
            }
        }
    });
var addressSchema = function(data){
    if(data===undefined){
        var data = {};
    }
    this.province = data.province || {
        name:'',
        index:0
    };
    this.areaType = data.areaType || {
        name:'',
        index:0
    };
    this.area = data.area || {
        name:'',
        index:0
    };
    this.address = data.address || '';
    this.name = data.name || '';
    this.tel = data.tel || '';
};
var userModel = global.db.model('user',userSchema);
//定义用户权限
var appGrade = {
    index:{
        user:{
            edit:false,
            upload:false
        },
        admin:{
            edit:true,
            upload:true
        }
    },
    user:{
        user:{
            login:true,
            editAddress:true,
            changeName:true,
            changeMail:false,
            changePassword:true,
            editUser:false,
            upload:false
        },
        admin:{
            login:true,
            editAddress:true,
            changeName:true,
            changeMail:true,
            changePassword:true,
            editUser:true,
            upload:true
        }
    },
    message:{
        user:{
            read:true,
            send:true,
            remove:false,
            upload:false
        },
        admin:{
            read:true,
            send:true,
            remove:true,
            upload:true
        }
    },
    shop:{
        user:{
            buy:true,
            comment:false,
            editGood:false,
            upload:false
        },
        admin:{
            buy:true,
            comment:true,
            editGood:true,
            upload:true
        }
    },
    class:{
        user:{
            read:true,
            add:false,
            edit:false,
            upload:false
        },
        admin:{
            read:true,
            add:true,
            edit:true,
            upload:true
        }
    },
    blog:{
        user:{
            write:false,
            comment:true,
            edit:false,
            revise:false,
            upload:false
        },
        admin:{
            write:true,
            comment:true,
            edit:true,
            revise:true,
            upload:true
        }
    },
    statistics:{
        user:{
            view:false,
            memberInfo:false,
            upload:false
        },
        editor:{
            view:true,
            memberInfo:false,
            upload:false
        },
        admin:{
            view:true,
            memberInfo:true,
            upload:true
        }
    },
    console:{
        user:{
            edit:false,
            upload:false
        },
        admin:{
            edit:true,
            upload:true
        }
    },
    cloth:{
        user:{
            edit:false,
            upload:false
        },
        admin:{
            edit:true,
            upload:true
        }
    }
}
var userGrade = {
    admin:{
        index:appGrade.index.admin,
        user:appGrade.user.admin,
        message:appGrade.message.admin,
        shop:appGrade.shop.admin,
        class:appGrade.class.admin,
        blog:appGrade.blog.admin,
        statistics:appGrade.statistics.admin,
        console:appGrade.console.admin,
        cloth:appGrade.cloth.admin
    },
    user:{
        index:appGrade.index.user,
        user:appGrade.user.user,
        message:appGrade.message.user,
        shop:appGrade.shop.user,
        class:appGrade.class.user,
        blog:appGrade.blog.user,
        statistics:appGrade.statistics.user,
        console:appGrade.console.user,
        cloth:appGrade.cloth.user
    },
    blogEditor:{
        index:appGrade.index.user,
        user:appGrade.user.user,
        message:appGrade.message.user,
        shop:appGrade.shop.user,
        class:appGrade.class.user,
        blog:appGrade.blog.admin,
        statistics:appGrade.statistics.editor,
        console:appGrade.console.user,
        cloth:appGrade.cloth.user
    },
    shopAssistant:{
        index:appGrade.index.user,
        user:appGrade.user.user,
        message:appGrade.message.user,
        shop:appGrade.shop.admin,
        class:appGrade.class.user,
        blog:appGrade.blog.user,
        statistics:appGrade.statistics.editor,
        console:appGrade.console.user,
        cloth:appGrade.cloth.user
    }
}

var userApi = {
    addressSchema:addressSchema,
    register:function (userData,callback){
        userModel.findOne({name:userData.name},function(err,user){
            if(user===null){
                userModel.findOne({mail:userData.mail},function(err,user){
                   if(user===null){
                       userData.permission = userGrade.user;
                       var addUserData = new userModel(userData);
                       addUserData.save(function(err){
                           callback(err);
                       });
                   }else{
                       callback({success:0,description:'该邮件地址已被注册。'});
                   }
                });
            }else{
                callback({success:0,description:'该用户名已被使用。'});
            }
        });
    },
    getUserInfo:function (userData,callback){
        userModel.findOne(userData,function(err,user){
            callback(err,user);
        });
    },
    ifUser:function(query,callback){
        userModel.findOne(query,function(err,user){
            user.password = undefined;
            callback(err,user);
        });
    },
    login:function(userData,callback){
        if(/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,4}$/.test(userData.account)){//mail
            userModel.findOne({
                mail:userData.account,
                password:userData.password
            },function(err,user){
                if(!user || err){
                    callback(null);
                }else{
                    userModel.findOne({mail:userData.account},function(err,user){
//                        user.password = undefined;
                        callback(true,user);
                    });
                }
            });
        }else{//name
            userModel.findOne({
                name:userData.account,
                password:userData.password
            },function(err,user){
                if(!user || err){
                    callback(null);
                }else{
                    userModel.findOne({name:userData.account},function(err,user){
//                        user.password = undefined;
                        callback(true,user);
                    });
                }
            });
        }
    },
    checkLogin:function(req,res,callback){
        //session验证
        if(req.session.user){
            userModel.findOne({
                name:req.session.user.name,
                mail:req.session.user.mail,
                password:req.session.user.pw
            }).exec(function(err,userData){
                if(err===null && userData!==null){
                    if(userData.state!==0){
                        callback(true,userData);
                    }else{
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            });
        }else{
            callback(false);
        }
    },
    socketIoCheckLogin:function(session,callback){
        if(session){
            if(session.user){
                userModel.findOne({
                    name:session.user.name,
                    mail:session.user.mail,
                    password:session.user.pw
                }).exec(function(err,userData){
                    if(err===null && userData!==null){
                        if(userData.state!==0){
                            callback(true,userData);
                        }else{
                            callback(false);
                        }
                    }else{
                        callback(false);
                    }
                });
            }
        }else{
            callback(false);
        }
    },
    checkAdministratorPermission:function(userData,callback){
        userData.permission = 'administrator';
        userModel.findOne(userData,function(err,data){
           callback(err,data);
        });
    },
    isAdmin:function(req,callback){
        if(req.cookies.name){
            userModel.findOne({
                name:req.cookies.name,
                mail:req.cookies.mail
            },function(err,user){
                if(user!==null){
                    var mii_login = global.config.encryptCookie({
                        name:user.name,
                        mail:user.mail,
                        password:user.password
                    });
                    if(mii_login===req.cookies.mii_login){//logined
                        if(user.permission==='administrator'){
                            callback(true);
                        }else{
                            callback(false);
                        }
                    }else{//unlogined
                        callback(false);
                    }
                }else{
                    callback(false);
                }
            });
        }else{
            callback(false);
        }
    },
    getUserInfoByArray:function(userArray,select,callback){
        userModel.find()
            .where('_id').in(userArray)
            .select(select)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    addAddress:function(userId,addressData,callback){
        userModel.findById(userId,function(err,data){
            if(data && data.address){
                data.address.push(addressData);
                data.save(function(err,data){
                    callback(err,data);
                });
            }
        });
    },
    deleteAddress:function(userId,addressIndex,callback){
        userModel.findById(userId,function(err,data){
            data.address.splice(addressIndex,1);
            data.save(function(err,data){
                callback(err,data);
            });
        });
    },
    modifyAddress:function(userId,modifyData,callback){
        userModel.findById(userId,function(err,data){
            /*console.log(data.address[modifyData.addressIndex]);
            console.log(modifyData.addressData);
            callback(err,data);*/
//            data.address[modifyData.addressIndex] = modifyData.addressData;
            data.address.set(modifyData.addressIndex,modifyData.addressData);
            console.log(data.address[modifyData.addressIndex]);
            data.save(function(err,data){
                callback(err,data);
            });
        });
    },
    getUserList:function(findData,skip,limit,callback){
        userModel.find(findData)
            .sort({'_id':1})
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            })
    },
    getUserInfoById:function(id,callback){
        userModel.findById(id)
            .sort({'_id':1})
            .exec(function(err,data){
           callback(err,data);
        });
    },
    editUserById:function(id,data,callback){
        userModel.findById(id,function(err,userData){
            if(err===null && data!==null){
                userData.name=data.name;
                userData.mail=data.mail;
                userData.permission=data.permission;
                userData.save(function(err){
                    callback(err);
                });
            }else{
                callback(err);
            }
        });
    },
    saveSID:function(id,sid,callback){
        userModel.findByIdAndUpdate(id,{"$set":{sid:sid}},callback);
    },
    setPermission:function(userId,appName,permissionData,callback){
        //设定指定用户在某一应用内的权限
        userModel.findById(id,function(err,userData){
            if(err===null && data!==null && typeof appName==='string' && typeof permissionData==='object' && permissionData.constructor === Object && permissionData!=={}){
                if(userData.permission[appName]){
                    for(var permissionItemName in permissionData){
                        userData.permission[appName][permissionItemName] = permissionData[permissionItemName];
                    }
                }else{
                    //对于该用户，这是一个全新的应用呢。
                    userData.permission[appName]=permissionData;
                }
                userData.save(function(err1){
                    callback(err1);
                });
            }else{
                callback(err);
            }
        });
    },
    findUser:function(find,sort,skip,limit,callback){
        userModel.find(find)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(callback);
    },
    getListItemCount:function(find,callback){
        //统计列表分页数量
        userModel.find(find).count().exec(callback);
    }
}
module.exports = userApi;
/*
* session
* */
var sessionSchema = new mongoose.Schema({
        sid: {
            type:String,
            index:true
        },
        session: mongoose.Schema.Types.Mixed
    }),
    SessionModel = global.db.model('sessions', sessionSchema);
var MongooseSession = function () {
    this.__proto__ = (require('express-session').Store).prototype;
    this.mongoose = mongoose;
    this.get = function(sid, callback) {
        var self = this;
        SessionModel.findOne({ sid: sid })
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    if (results) {
                        callback(null, results.session);
                    } else {
                        callback(null);
                    }
                }
            });
    };
    this.set = function(sid, session, callback) {
        var self = this;
        SessionModel.update(
            { sid: sid },
            { sid: sid, session: session },
            { upsert: true },
            function(err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
    };
    this.destroy = function(sid, callback) {
        var self = this;
        SessionModel.remove({ sid: sid })
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
    };
    this.length = function(callback) {
        var self = this;
        SessionModel.find()
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null, results.length);
                }
            });
    };
    this.clear = function(callback) {
        var self = this;
        SessionModel.remove()
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
    };
};

module.exports.session = function() {
    return new MongooseSession();
};