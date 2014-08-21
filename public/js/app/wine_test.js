/**
 * Created by boooo on 14-8-21.
 */
var cache = {
    score:0,
    imageElement:{},
    childCount:0,
    childScore:0,
    onclick:false,
    randomIndex:1,
    start:false,
    startTime:new Date(),
    playTime:30,//每局游戏时间，单位为秒
    time2die:30//剩余时间，单位为秒
};
var itemSize= 120;
var startPlayTime = function(timeString){
    cache.start=true;
    cache.startTime=new Date();
    cache.time2die=30;
    cache.playTimeSetInterval=window.setInterval(function(){
        refreshPlayTime(timeString);
    },1000);
}
var refreshPlayTime = function(timeString){
    cache.time2die=cache.playTime - Math.round((new Date() - cache.startTime)/1000);
    timeString.setValue("剩余时间:"+cache.time2die+'s');
    if(cache.time2die<=0){
        window.clearInterval(cache.playTimeSetInterval);
    }
    console.log(cache.time2die);
}
Cut(function(root, container) {
    Cut.Mouse(root, container, true);
    root.viewbox(360, 720);


    //绘制酒瓶
    var last = null,
        clickCount = 0;
    root.on("viewport", function(width, height) {
        itemWidth=width/3;
    });

    var row = Cut.column(0.5).pin({'alignX':0.5,'alignY':1,pivotY:0}).appendTo(root);
    var addLabItem = function(){
        var line = Cut.row(0.5).prependTo(row),
            el;
        for (var i = 0; i < Math.floor(Math.random()*4+1); i++) {
            cache.randomIndex = Math.floor(Math.random()*8+1);
            el = Cut.image("beer:"+cache.randomIndex).pin({
                scaleMode:'in',
                scaleWidth:itemSize,
                scaleHeight:itemSize
            }).appendTo(line).on(
                Cut.Mouse.CLICK, function(ev, point) {
                    //启动计时
                    if(!cache.start){
                        startPlayTime(timeString);
                    }else if(cache.time2die>0){//检测时间
                        //添加滚动锁定
                        cache.onclick = true;
                        clickCount++;
                        if (this != last) {
                            last = this;
                            //替换开瓶后的图片
                            switch(this.score){
                                case 1:
                                    this.setImage('beer:9').pin({
                                        scaleMode:'in',
                                        scaleWidth:itemSize,
                                        scaleHeight:itemSize
                                    });
                                    break;
                                case 2:
                                    this.setImage('beer:10').pin({
                                        scaleMode:'in',
                                        scaleWidth:itemSize,
                                        scaleHeight:itemSize
                                    });
                                    break;
                                case 3:
                                    this.setImage('beer:11').pin({
                                        scaleMode:'in',
                                        scaleWidth:itemSize,
                                        scaleHeight:itemSize
                                    });
                                    break;
                                case 5:
                                    this.setImage('beer:12').pin({
                                        scaleMode:'in',
                                        scaleWidth:itemSize,
                                        scaleHeight:itemSize
                                    });
                                    break;
                                default :
                                    break;
                            }
                            /*this.setImage('beerok:test').pin({
                             scaleMode:'in',
                             scaleWidth:itemSize,
                             scaleHeight:itemSize
                             });*/
//                        this.score=true;
                            //更新得分
                            cache.score+=this.score;
                            scoreString.setValue("干掉"+cache.score+'瓶');

                        }
                        //移动酒瓶列表
                        row.tween(duration = 100, delay = 0).pin({
                            offsetY:itemSize*clickCount
                        }).then(function(){
                            //解除滚动锁定
                            cache.onclick = false;
                            //回收资源
                            row.last().remove();
                            row.pin({
                                offsetY:row.pin('offsetY')-itemSize
                            });
                            clickCount--;
                            console.log(row.pin('offsetY'));
                            //添加元素
                            addLabItem();
                        });
                    }
                    return true;
                }
            );
            switch (true){
                case cache.randomIndex<=3:
                    el.score=1;
                    break;
                case cache.randomIndex<=6:
                    el.score=2;
                    break;
                case cache.randomIndex===7:
                    el.score=3;
                    break;
                case cache.randomIndex===8:
                    el.score=5;
                    break;
                default :
                    el.score=0;
                    break;
            }
        }
    }
    for (var i = 0; i < 7; i++) {
        addLabItem();
    }
    //绘制分数
    var scorerow = Cut.row().pin({
        align : -0.5,
        handle : 0,
        offsetX:250,
        offsetY:380,
        height:500
    }).appendTo(root);
    var scoreBox = Cut.row().appendTo(root).pin({
        offsetX:10,
        offsetY:10
    });
    var scoreString =  Cut.string('base:d_').appendTo(scoreBox);
    scoreString.pin({
        offsetX:0,
        offsetY:0,
        height:50
    });
    scoreString.setValue("干掉"+cache.score+'瓶');
    scorerow.on(Cut.Mouse.CLICK,function(ev,point){
        row.last().remove();
        row.pin({
            offsetY:row.pin('offsetY')-itemSize
        })
    });
    //绘制时间
    var timeBox = Cut.row().appendTo(root).pin({
        offsetX:-10,
        offsetY:10,
        alignX:1
    });
    var timeString =  Cut.string('base:d_').appendTo(timeBox);
    /*timeString.pin({
        offsetX:0,
        offsetY:0,
        height:50
    });*/
    timeString.setValue("挑战时间:"+cache.time2die+'s');
    //绘制引导

});

/*texture*/
var PPU = 64;
Cut.addTexture(texture = {
    name : 'beer',
    imagePath : '/img/wine/beers8.png',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : '1',
            x : 0,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '2',
            x : 120,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '3',
            x : 240,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '4',
            x : 360,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '5',
            x : 480,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '6',
            x : 600,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '7',
            x : 720,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '8',
            x : 840,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '9',
            x : 960,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '10',
            x : 1080,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '11',
            x : 1200,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '12',
            x : 1320,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : '13',
            x : 1440,
            y : 0,
            width : 120,
            height : 120,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        }
    ]
});
Cut.addTexture(texture = {
    name : 'beerok',
    imagePath : '/img/wine/labok.png',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : 'test',
            x : 0,
            y : 0,
            width : 144,
            height : 144,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        }
    ]
});
Cut.addTexture({
    name : "base",
    factory : function(name) {
        if (name.substring(0, 2) === "d_") {
            var d = name.substr(2, 1);
            return Cut.Out.drawing("d_" + d, 24, 24, 10, function(ctx, ratio) {
                ctx.scale(ratio, ratio);
                ctx.font = "bold 24px Arial";
                ctx.fillStyle = "#000";
                ctx.measureText && this.cropX(ctx.measureText(d).width + 0.4);
                ctx.textBaseline = "top";
                ctx.fillText(d, 0, 0);
            });
        }
    }
});