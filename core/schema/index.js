/**
 * Created by boooo on 14-8-23.
 */
var indexSchema = new global.mongoose.Schema({
    type:{type:String,default:'system',index:true},
    style:{type:String,default:'default',index:true},
    image:global.mongoose.Schema.Types.Mixed,
    text:global.mongoose.Schema.Types.Mixed,
    user:{
        "_id":{type:String,index:true},
        name:{type:String,index:true}
    },
    useTime:{ type : Date, index:true },
    createTime:{ type : Date, default: Date.now }
});
var indexModel = global.db.model('index',indexSchema);

module.exports = {
    add:function(data,callback){
        var indexData = new indexModel(data);
        indexData.save(callback);
    },
    find:function(find,sort,skip,limit,callback){
        indexModel.find(find)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(callback);
    },
    update:function(id,data,callback){
        indexModel.findByIdAndUpdate(id,{"$set":data},callback);
    },
    getUseOne:function(callback){
        indexModel.findOne().sort({useTime:-1}).exec(callback);
    }
}
