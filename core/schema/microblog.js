/**
 * Created by boooo on 14-10-9.
 */
var microblogSchema = new global.mongoose.Schema({
    _creator: { type: Schema.ObjectId, ref: 'user' },
    content:{type:String,default:''},
    type:{type:String,defaylt:'text',index:true},
    images:[{
        type:global.mongoose.Schema.Types.Mixed
    }],
    files:[{
        type:global.mongoose.Schema.Types.Mixed
    }],
    createTime:{ type : Date, default: Date.now },
    count:{
        digg:{type:Number, default: 0},
        commit:{type:Number,default:0},
        relink:{type:Number,default:0}
    },
    state:{type:Number,default:1,index:true}
});
var microBlog= global.db.model('microblog',microblogSchema);

module.exports = {
    new:function(userId,content,type,images,files,callback){
        //保存新微博内容
        if(userId){
            //生成用户id
            userId = new global.mongoose.Schema.Types.ObjectId(userId);
            //新建微博
            var newMicroBlog = new microBlog({
                _creator:userId,
                content:content,
                type:type,
                images:images,
                files:files
            });
            newMicroBlog.save(function(err,data){
                callback(err,data);
            });
        }else{
            callback(true);
        }
    },
    get:function(id,callback){
        //获取单条微博数据
        microBlog.findById(id).populate('_creator').exec(callback);
    },
    getList:function(query,skip,limit,callback){
        //获取多条微博
        microBlog.find(query)
            .skip(skip)
            .limit(limit)
            .exec(callback);
    },
    delete:function(id,callback){
        microBlog.findById(id).exec(function(err,data){
            if(!err){
                data.state = 0;
                data.save(callback);
            }else{
                callback(err);
            }
        });
    }
};