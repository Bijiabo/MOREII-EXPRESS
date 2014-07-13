/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    config = require('../config'),
    db = require('../db');
var userSchema = new mongoose.Schema({
        name:{
            type:'String',
            required:true
        },
        mail:{
            type:'String',
            required:true
        },
        password:{
            type:'String',
            required:true
        },
        phone:String,
        address:Array,
        permission:{
            user:{
                login:Boolean,
                editAddress:Boolean,
                changeName:Boolean,
                changeMail:Boolean,
                changePassword:Boolean,
                editUser:Boolean
            },
            message:{
                read:Boolean,
                send:Boolean,
                remove:Boolean
            },
            shop:{
                buy:Boolean,
                comment:Boolean,
                editGood:Boolean
            },
            class:{
                read:Boolean,
                add:Boolean,
                edit:Boolean
            },
            blog:{
                comment:Boolean,
                edit:Boolean
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
var userModel = db.model('user',userSchema);
//定义用户权限
var appGrade = {
    user:{
        user:{
            login:true,
            editAddress:true,
            changeName:true,
            changeMail:false,
            changePassword:true,
            editUser:false
        },
        admin:{
            login:true,
            editAddress:true,
            changeName:true,
            changeMail:true,
            changePassword:true,
            editUser:true
        }
    },
    message:{
        user:{
            read:true,
            send:true,
            remove:false
        },
        admin:{
            read:true,
            send:true,
            remove:true
        }
    },
    shop:{
        user:{
            buy:true,
            comment:false,
            editGood:false
        },
        admin:{
            buy:true,
            comment:true,
            editGood:true
        }
    },
    class:{
        user:{
            read:true,
            add:false,
            edit:false
        },
        admin:{
            read:true,
            add:true,
            edit:true
        }
    },
    blog:{
        user:{
            comment:true,
            edit:false
        },
        admin:{
            comment:true,
            edit:true
        }
    }
}
var userGrade = {
    admin:{
        user:appGrade.user.admin,
        message:appGrade.message.admin,
        shop:appGrade.shop.admin,
        class:appGrade.class.admin,
        blog:appGrade.blog.admin,
    },
    user:{
        user:appGrade.user.user,
        message:appGrade.message.user,
        shop:appGrade.shop.user,
        class:appGrade.class.user,
        blog:appGrade.blog.user,
    },
    blogEditor:{
        user:appGrade.user.user,
        message:appGrade.message.user,
        shop:appGrade.shop.user,
        class:appGrade.class.user,
        blog:appGrade.blog.admin,
    },
    shopAssistant:{
        user:appGrade.user.user,
        message:appGrade.message.user,
        shop:appGrade.shop.admin,
        class:appGrade.class.user,
        blog:appGrade.blog.user,
    }
}

module.exports = {
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
                if(user===null){
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
                if(user===null){
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
        if(req.cookies.name){
            userModel.findOne({
                name:req.cookies.name
            },function(err,user){
                if(user!==null){
                    var mii_login = config.encryptCookie({
                        name:user.name,
                        mail:user.mail,
                        password:user.password
                    });
                    if(mii_login===req.cookies.mii_login){//logined
                        callback(true);
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
                    console.log(config.cookieSecret);
                    var mii_login = config.encryptCookie({
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
            data.address.push(addressData);
            data.save(function(err,data){
                callback(err,data);
            });
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
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            })
    },
    getUserInfoById:function(id,callback){
        userModel.findById(id,function(err,data){
           callback(err,data);
        });
    }
}