/**
 * Created by boooo on 14-5-23.
 */
var crypto = require('crypto');
var cookieSecret = 'hcblhy10260326';
var encryptCookie = function(data){//加密cookie
    var sha1 = crypto.createHash('sha1');
    var dataString=cookieSecret;
    for(var item in data){
        dataString+=String(data[item]);
    }
    sha1.update(dataString);
    return sha1.digest('hex');
};
module.exports = {
    cookieSecret: cookieSecret,
    domain: 'localhost',
    siteUrl:'http://localhost:3001/',
    siteName:'moreii',
    logo:'moreii',
    encryptCookie:encryptCookie,
    inArray:function (needle,array,bool){
        if(typeof needle=="string"||typeof needle=="number"){
            var len=array.length;
            for(var i=0;i<len;i++){
                if(needle===array[i]){
                    if(bool){
                        return i;
                    }
                    return true;
                }
            }
            return false;
        }
    }
};