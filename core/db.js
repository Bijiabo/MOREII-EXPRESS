/**
 * Created by boooo on 14-5-17.
 */
var mongoose = require('mongoose'),
    db = mongoose.createConnection('localhost','moreii');

db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
    //一次打开记录
});
module.exports = db;