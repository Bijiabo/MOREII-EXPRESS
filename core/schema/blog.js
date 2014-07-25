/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var ObjectId = mongoose.Schema.Types.ObjectId;
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
    random:{ type : Number, default: Math.random(),index:true},
    createTime:{ type : Date, default: Date.now },
    version:{ type : Number, default: 1},
    state:{type : Number, default: 1,index:true},
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
        data.random = Math.random();
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
                        blogId:blogDataSaved._id.toString(),
                        contentIndex:i,
                        content:originalContent.slice(i*slicePerLength,(i+1)*slicePerLength)+'\t\t\t',
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
                                    content:originalContent.slice(i*slicePerLength,(i+1)*slicePerLength)+'\t\t\t',
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
                if(err===null && doc!==null){
                    doc.count.view++;
                    doc.save(function(err,doc){
                        callback(err,doc);
                    });
                }else{
                    callback(err);
                }
            });
    },
    randomBlog:function(limit,callback){
        var random = Math.random();
        blogModel.find({"random" : {"$gt" : random}})
            .limit(limit)
            .exec(function(err,data){
                if(err===null && data===null){
                    blogModel.findOne({"random" : {"$lt" : random}})
                        .exec(function(err,data){
                            callback(err,data);
                        });
                }else{
                    callback(err,data);
                }
            });
    },
    deleteBlogs:function(idArray,callback){
        blogModel.update({_id:{$in:idArray}},{$set:{state:0}},function(err,data){
            callback(err,data);
        });
    },
    //统计作者
    statisticAuthor:function(limit,callback){
        blogModel.aggregate(
            {
                "$project":{
                    "author":1,
                    'version':1,
                    "createTime":1,
                    "modify":1,
                    "tag":1,
                    "createdIn":{"$month":"$createTime"}
                }
            },
            {
                "$group":{
                    "_id":"$author.id",
                    "name":{"$addToSet":"$author.name"},
                    "blogCount":{"$sum":1},
                    "tag":{"$addToSet":"$tag"},
                    "activeMonth":{"$push":"$createdIn"}
                }
            },{"$limit":10}
        ).exec(function(err,data){
                callback(err,data);
            });
    },
    //统计月份内博客发布情况
    statisticBlogByMonth:function(year,month,callback){
        blogModel.aggregate(
            {
                "$match":{
                    "createTime":{"$gt":new Date(year+'/'+month+'/01'),"$lt":new Date(year+'/'+(month+1)+'/01')}
                }
            },
            {
                "$project":{
                    'version':1,
                    "createTime":1,
                    "modify":1,
                    "createdDayOfMonth":{"$dayOfMonth":"$createTime"}
                }
            },
            {
                "$group":{
                    "_id":"$createdDayOfMonth",
                    "blogCount":{"$sum":1},
                    "time":{"$addToSet":"$createdDayOfMonth"}
                }
            }
        ).exec(function(err,data){
                callback(err,data);
            });
    },
    //搜索标签
    findByTags:function(tagArray,sort,skip,limit,callback){
        blogModel.find({tag:{"$all":tagArray}})
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(function(err,data){
                callback(err,data);
            });
    },
    //统计列表分页数量
    getListItemCount:function(find,callback){
        blogModel.find(find)
            .count()
            .exec(function(err,data){
                callback(err,data);
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