/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var blogSchema = new mongoose.Schema({
    title:String,
    content:String,
    tag:{type:Array,index:true},
    author:{
        id:String,
        name:String
    },
    count:{
        digg:{ type : Number, default: 0},
        view:{ type : Number, default: 0}
    },
    createTime:{ type : Date, default: Date.now },
    version:{ type : Number, default: 1},
    modify:[
        {
            uid:{type:String,index:true},
            name:{type:String,index:true},
            time:{type : Date, default: Date.now},
            version:{ type : Number, default: 2}
        }
    ]
});
var blogContentSchema = new mongoose.Schema({
    blogId:{type:String,index:true},
    contentIndex:{type:Number,index:true},
    content:String,
    version:{type:Number,index:true}
});
var blogModel = db.model('blog',blogSchema);
var blogContentModel = db.model('blogContent',blogContentSchema);

module.exports = {
    add:function(data,callback){
        var originalContent = data.content;
        data.content = originalContent.cutStrButUrl(300,'......');
        var blogData = new blogModel(data);
        blogData.save(function(err,blogDataSaved){
            if(err===null){
                var slicePerLength = 1000,
                    contentSliceCount = Math.ceil(originalContent.length / slicePerLength),
                    contentSaved = 0,
                    contentSavedError = 0,
                    blogContentData;
                for(var i=0;i<contentSliceCount;i++){
                    blogContentData = new blogContentModel({
                        blogId:blogDataSaved._id,
                        contentIndex:i,
                        content:originalContent.slice(i*slicePerLength,(i+1)*slicePerLength),
                        version:1
                    });
                    blogContentData.save(function(err){
                        contentSaved++;
                        if(err!==null){
                            contentSavedError++;
                        }
                        if(contentSaved === contentSliceCount){
                            if(contentSavedError>0){
                                callback(true);
                            }else{
                                callback(null,blogDataSaved);
                            }
                        }
                    });
                }
            }else{
                callback(err);
            }
        });
    },
    update:function(_id,blogData,userData,callback){
        blogModel.findById(_id)
            .exec(function(err,originalData){
                if(err===null && originalData!==null){
                    originalData.title = blogData.title;
                    originalData.tag = blogData.tag;
                    var versionNow = originalData.version + 1;
                    originalData.version = versionNow;
                    originalData.modify.push({
                        uid:userData._id.toString,
                        name:userData.name,
                        time:new Date(),
                        version:versionNow
                    });
                    var originalContent = blogData.content;
                    originalData.content = originalContent.cutStrButUrl(300,'......');
                    originalData.save(function(err1,savedData){
                        if(err1===null){
                            /**
                             * 保存博客概要成功，开始存储文章内容
                             * */
                            var slicePerLength = 1000,
                                contentSliceCount = Math.ceil(originalContent.length / slicePerLength),
                                contentSaved = 0,
                                contentSavedError = 0,
                                blogContentData;
                            for(var i=0;i<contentSliceCount;i++){
                                blogContentData = new blogContentModel({
                                    blogId:savedData._id.toString(),
                                    contentIndex:i,
                                    content:originalContent.slice(i*slicePerLength,(i+1)*slicePerLength),
                                    version:versionNow
                                });
                                blogContentData.save(function(err){
                                    contentSaved++;
                                    if(err!==null){
                                        contentSavedError++;
                                    }
                                    if(contentSaved === contentSliceCount){
                                        if(contentSavedError>0){
                                            callback(true);
                                        }else{
                                            callback(null,versionNow);
                                        }
                                    }
                                });
                            }
                          }else{
                            callback(err1);
                        }
                    });
                }else{
                    callback(err,originalData);
                }
            });
    },
    listBlog:function(queryData,skip,limit,callback){
        blogModel.find(queryData)
            .skip(skip)
            .limit(limit)
            .sort({'_id':-1})
            .exec(function(err,data){
                callback(err,data);
            });
    },
    blogDetail:function(id,callback){
        blogModel.findById(id)
            .exec(function(err,doc){
                if(err===null){
                    blogContentModel.find({blogId:id,version:doc.version})
                        .sort({'_id':1})
                        .exec(function(err,data){
                            callback(err,{
                                info:doc,
                                content:data
                            });
                        });
                }else{
                    callback(err);
                }
            });
    },
    blogDetailView:function(id,callback){
        blogModel.findById(id)
            .exec(function(err,doc){
                doc.count.view++;
                doc.save(function(err,doc){
                    callback(err,doc);
                });
            });
    }
}








String.prototype.sizeAt = function(){
    var nLen = 0;
    for(var i = 0, end = this.length; i<end; i++){
        nLen += this.charCodeAt(i)>128?2:1;
    }
    return nLen;
};
String.prototype.cutStr = function(n, sCut){
    if(this.sizeAt() <= n){
        return this;
    }
    sCut = sCut || "";
    var max = n-sCut.sizeAt();
    var nLen = 0;
    var s = this;
    for(var i =0,end = this.length;i<end;i++){
        nLen += this.charCodeAt(i)>128?2:1;
        if(nLen>max){
            s = this.slice(0,i);
            s += sCut;
            break;
        }
    }
    return s.toString();
};
String.prototype.cutStrButUrl = function(n, sCut){
    if(this.sizeAt() <=n){
        return this.toString();
    }
    sCut = sCut || "";
    var max = n-sCut.sizeAt();
    var s = this;
//查找所有包含的url
    var aUrl = s.match(/https?\:\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-_A-Z0-9a-z$\.+!*\/\,\:\;\@\&\=\?\~\#\%]*)*/gi);
//当第max个字符刚好在url之间时，bCut会被设置为flase;
    var bCut = true;
    if(aUrl){
//对每个url进行判断
        for(var i=0, endI = aUrl.length;i<endI;i++){
            var sUrl = aUrl[i];
//可能出现两个相同url的情况
            var aP = s.split(sUrl);
            var nCurr = 0;
            var nLenURL = sUrl.sizeAt();
            var sResult = "";
            for(j = 0, endJ = aP.length; j<endJ; j++){
                nCurr +=aP[j].sizeAt();
                sResult +=aP[j];
                sResult += sUrl;
//当前字数相加少于max但添加url超过max：即会截到url
                if(nCurr < max && nCurr + nLenURL>max){
                    s = sResult + sCut;
                    bCut = false;
                    break;
                }
                nCurr += nLenURL;
            }
            if(bCut === false){
                break;
            }
        };
    }
    if(bCut){
        s = s.cutStr(n, sCut);
    }
    return s.toString();
};