/**
 * Created by boooo on 14-5-23.
 */
var crypto = require('crypto'),
    cookieSecret = 'hcblhy10260326',
    encryptCookie = function(data){//加密cookie
        var sha1 = crypto.createHash('sha1');
        var dataString=cookieSecret;
        for(var item in data){
            dataString+=String(data[item]);
        }
        sha1.update(dataString);
        return sha1.digest('hex');
    },
    domain = 'localhost',//站点域名
    port = '3001',
    siteName = 'Moreii',
    logo = 'Moreii';

module.exports = {
    cookieSecret: cookieSecret,
    domain: domain,
    siteUrl:'http://'+domain+':'+port+'/',
    siteName:siteName,
    logo:logo,
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
    },
    resError: function(req,res,des,redirectUrl){
        if(req.query.ajax === 'true'){
            res.send(JSON.stringify({
                err:true,
                des:des,
                redirectUrl:redirectUrl
            }));
        }else{
            res.redirect(redirectUrl);
        }
    },
    securityFilter:function(x){
        if(typeof x==='string') {//过滤字符串
            x= x.replace(/[\<\>\&\#]+/ig,'');
        }
        return x;
    }
};