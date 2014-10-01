/**
 * Created by boooo on 14-10-1.
 */
var fs = require("fs"),
    path = require('path'),
    zip = require("node-native-zip");

var archive = new zip(),
    dataPath = path.join(__dirname,'../data/Tue, 23 Sep 2014 16:27:26 GMT/moreii'),
    fileList = [];
fs.readdir(dataPath,function(err,files){
    if(!err&&files.length>0){
        for(var i= 0,len=files.length;i<len;i++){
            fileList.push({
                name:files[i],
                path:path.join(dataPath,files[i])
            });
        }
        archive.addFiles(fileList, function (err) {
            if (err) return console.log("err while adding files", err);

            var buff = archive.toBuffer();

            fs.writeFile("./test2.zip", buff, function () {
                console.log("Finished");
            });
        });
    }
});

