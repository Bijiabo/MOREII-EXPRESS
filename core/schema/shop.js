/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = require('../db');
var shopSchema = new mongoose.Schema({
    name:String,
    picture:Array,
    description:String,
    color:Array,
    price:Number,
    count:{
        favorite:Number,
        view:Number,
        comment:Number
    },
    type:String,
    same_good:Array,
    index:Number
});
var shopModel = db.model('shop',shopSchema);

module.exports = {
    addGood:function(goodData,callback){
        var good = new shopModel(goodData);
        good.save(function(err){
            callback(err);
        });
    },
    listGood:function(queryData,skip,limit,callback){
        shopModel.find(queryData)
            .skip(skip)
            .limit(limit)
            .sort({'_id':-1})
            .exec(function(err,data){
                callback(err,data);
                console.log(data);
            });
    },
    goodDetail:function(goodId,callback){
        shopModel.findById(goodId)
            .exec(function(err,data){
                callback(err,data);
            });
    }
}