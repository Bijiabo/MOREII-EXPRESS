/**
 * Created by boooo on 14-8-23.
 */
var mongoose = require('mongoose'),
    db = require('../db');
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
var wineSchema = db.model('wines',wineSchema);

module.exports = {
    add:function(data,callback){
        var wineData = new wineSchema(data);
        wineData.save(callback);
    },
    getRank:function(score,callback){
        wineSchema.find().where('score').lt(score).count().exec(callback);
    },
    allCount:function(callback){
        wineSchema.find().count().exec(callback);
    },
    find:function(find,sort,skip,limit,callback){
        wineSchema.find(find)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec(callback);
    },
    getFindCount:function(find,callback){
        wineSchema.find(find)
            .count()
            .exec(callback);
    }
}
