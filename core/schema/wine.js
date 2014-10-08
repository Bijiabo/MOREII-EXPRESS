/**
 * Created by boooo on 14-8-23.
 */
var mongoose = require('mongoose');
var wineSchema = new mongoose.Schema({
    score:{
        type:Number,
        default:0,
        index:true
    },
    playTime:{
        type:Number,
        default:10,
        index:true
    },
    createTime:{ type : Date, default: Date.now }
});
var wineModel = global.db.model('wines',wineSchema);

module.exports = {
    add:function(data,callback){
        var wineData = new wineModel(data);
        wineData.save(callback);
    },
    getRank:function(score,callback){
        wineModel.find().where('score').lt(score).count().exec(callback);
    },
    allCount:function(callback){
        wineModel.find().count().exec(callback);
    },
    find:function(find,sort,skip,limit,callback){
        wineModel.find(find)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(callback);
    },
    getFindCount:function(find,callback){
        wineModel.find(find)
            .count()
            .exec(callback);
    }
}
