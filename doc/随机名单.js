/**
 * Created by boooo on 14-9-29.
 */
var l = [
    '红点奖经典作品',
    '西式甜点',
    '电脑DIY',
    '故宫里的皇帝',
    'Fixed Gear固齒單車',
    '安格尔的作品',
    '如何创建一家公司',
    '关于chanel小姐'
];
Array.prototype.randomList = function(){
    var listCache = this,
        randomListCache = [],
        randomIndex,
        randomListItem;
    for(var i= 0,len=listCache.length;i<len;i++){
        console.log(this);
        randomIndex = Math.floor(Math.random()*listCache.length);
        randomListItem = listCache.splice(randomIndex,1);
        randomListCache.push(randomListItem.toString());
    }
    return randomListCache;
}
l.randomList();