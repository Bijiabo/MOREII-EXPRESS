/**
 * Created by boooo on 14-9-23.
 */
var path = require('path'),
    spawn = require('child_process').spawn,
    ls    = spawn('mongodump', ['-d','moreii','-o',path.join(__dirname,'../data/'+(new Date()).toUTCString())]);

ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

ls.on('close', function (code,signal) {
    if(code===0 && signal ===null){
        console.log('备份成功!');
    }else{
        console.log('备份失败!');
        console.log('child process exited with code ' + code);
        console.log('signal:'+signal);
    }
});