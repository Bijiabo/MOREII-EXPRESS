/**
 * Created by boooo on 14-5-17.
 */
var db = global.mongoose.createConnection('localhost',global.config.dbname);

db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
    //一次打开记录
});
module.exports = db;