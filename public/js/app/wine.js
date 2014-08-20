/**
 * Created by boooo on 14-8-20.
 */
var cache = {
    startX:0,
    startY:0,
    latestY:0,
    scaleY:1,
    effectivity:false,
    score:0
};
Cut(function(root, container) {
    Cut.Mouse(root, container, true);
    root.viewbox(360, 720);
    //绘制分数
    var scoreString =  Cut.string("font:_").pin({
        align : -0.5,
        handle : 0,
        offset : 0.1
    }).appendTo(root);
    scoreString.setValue("Score:"+cache.score);
    //绘制酒瓶
    var row = Cut.row(0).appendTo(root).pin({
        "align": 0.5
    });
    var beer = Cut.image("beerbottle:beer");
    beer.appendTo(row);
    root.on(Cut.Mouse.START,function(ev,point){
        cache.startX=point.x;
        cache.startY=point.y;
        cache.latestY=cache.startY;
        if(Math.abs(document.body.clientWidth/2-point.x)<=80){
            cache.effectivity=true;
        }else{
            cache.effectivity=false;
        }
        beer.tween(duration = 100, delay = 0).clear().pin({
            scaleX : 1,
            scaleY : 1
        }).then(function(){
        });
    }).on(Cut.Mouse.MOVE,function(ev,point){
        if(cache.effectivity && point.y<cache.latestY){
            beer.tween(duration = 100, delay = 0).clear().pin({
                scaleX : 1.2,
                scaleY : 2
            }).then(function(){
            });
        }else{
            beer.tween(duration = 100, delay = 0).clear().pin({
                scaleX : 1,
                scaleY : 1
            }).then(function(){
            });
        }
        cache.latestY=point.y;
    }).on(Cut.Mouse.END,function(ev,point){
        cache.effectivity=false;//终止动作标记
        //得分
        cache.scaleY = beer.pin('scaleY');
        console.log(cache.scaleY);
        switch (true){
            case cache.scaleY>1.1 && cache.scaleY<1.2:
                cache.score+=10;
                break;
            case cache.scaleY>=1.2 && cache.scaleY<1.5:
                cache.score+=30;
                break;
            case cache.scaleY>=1.5:
                cache.score+=50;
                break;
        }
        console.log('score:'+cache.score);
        //恢复原始状态，动画
        beer.tween(duration = 100, delay = 0).clear().pin({
            scaleX : 1,
            scaleY : 1
        }).then(function(){
        });
    });
});

/*texture*/
var PPU = 64;
Cut.addTexture(texture = {
    name : 'beerbottle',
    imagePath : '/img/wine/beer.jpg',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : 'beer',
            x : 0,
            y : -200,
            width : 250,
            height : 750,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        }
    ]
},{
    name : "font",
    factory : function(name) {
        var prefix = "_";
        if (name.substring(0, prefix.length) === prefix) {
            var d = name.substr(prefix.length, 1);
            return Cut.Out.drawing(prefix + d, 32 / PPU, 18 / PPU, 128, function(ctx,ratio) {
                ctx.scale(ratio / PPU, ratio / PPU);
                ctx.font = "bold 16px monospace";
                ctx.fillStyle = "#000000";
                ctx.measureText && this.cropX((ctx.measureText(d).width) / PPU);
                ctx.textBaseline = "top";
                ctx.fillText(d, 0, 1);
            });
        }
    }
});