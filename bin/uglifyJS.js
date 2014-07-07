/**
 * Created by boooo on 14-6-19.
 */
var UglifyJS = require("uglify-js"),
    fs = require('fs'),
    path=require('path');
var jsFileArray = [
    path.join(__dirname,"../public/js/app/custom_make_encode.js")
];

var result = UglifyJS.minify(jsFileArray,{mangle:true});
fs.writeFileSync(path.join(__dirname,'../public/js/app/custom_make_encoded.js'),result.code,'utf8');
/*fs.open(path.join(__dirname,'../public/js/app/custom_make_encoded.js'),"w",function(e,fd){
//    if(e) throw e;
    fs.write(fd,'test',function(e){
//        if(e) throw e;
        fs.closeSync(fd);
    })
});*/

//console.log(result.code);