/**
 * Created by boooo on 14-8-20.
 */
var cache = {
    startX:0,
    startY:0,
    latestY:0,
    scaleY:1,
    effectivity:false,
    score:0,
    canvasElement:{},
    beerElementList:[],
    beerGroupType:1,
    rowX:0
};
var beerFunc = {
    randomBeerCount : function(){
        return Math.floor(Math.random()*3+1);
    },
    addBeer:function(beer){
        var maxListLength = 10;
        cache.beerGroupType = beerFunc.randomBeerCount();
        cache.beerElementList.push(beer['beer_'+cache.beerGroupType]);
        if(cache.beerElementList.length>maxListLength){
//            cache.beerElementList[0].remove();
            cache.beerElementList.shift();
        }
        return {
            element:cache.beerElementList[cache.beerElementList.length-1],
            index:cache.beerElementList.length-1
        };
    }
}

Cut(function(root, container) {
    Cut.Mouse(root, container, true);
    root.viewbox(360, 720).pin('handle', 0);
    //绘制分数
    var scorerow = Cut.row().pin({
        offset : 1,
        align : -0.5,
        handle : 0,
        offsetX:250,
        offsetY:380,
        height:500
    }).appendTo(root);
    var scoreString =  Cut.string('base:d_').appendTo(scorerow);
    scoreString.pin({
        offsetX:0,
        offsetY:0,
        height:50
    });
    scoreString.setValue("Score:"+cache.score);
    console.log(scorerow.pin('offsetX'));


    //绘制酒瓶
    var row = Cut.row(0).appendTo(root).pin({
        "align": 0.5,
        offsetX:0,
        offsetY:0
    });
    var column = Cut.column(0).appendTo(root).pin({
//        "align": 0.5,
        offsetX:0,
        offsetY:0
    });
    var beer={
        beer_1 : Cut.image("beerbottle:beer1"),
        beer_2 : Cut.image("beerbottle:beer2"),
        beer_3 : Cut.image("beerbottle:beer3")
    }
    var addBeer = beerFunc.addBeer(beer),
        beerNow = addBeer.element;
    beerNow.appendTo(row);
    beerNow.appendTo(column);
    root.on(Cut.Mouse.START,function(ev,point){
        cache.startX=point.x;
        cache.startY=point.y;
        cache.latestY=cache.startY;
        if(Math.abs(document.body.offsetWidth/2-point.x)<=80){
            cache.effectivity=true;
        }else{
            cache.effectivity=false;
        }
        beerNow.tween(duration = 100, delay = 0).clear().pin({
            scaleX : 1,
            scaleY : 1
        }).then(function(){
        });
    }).on(Cut.Mouse.MOVE,function(ev,point){
        if(cache.effectivity && point.y<cache.latestY){
            beerNow.tween(duration = 100, delay = 0).clear().pin({
                scaleX : 1.2,
                scaleY : 2
            }).then(function(){
            });
        }else{
            beerNow.tween(duration = 100, delay = 0).clear().pin({
                scaleX : 1,
                scaleY : 1
            }).then(function(){
            });
        }
        cache.latestY=point.y;
    }).on(Cut.Mouse.END,function(ev,point){
        cache.effectivity=false;//终止动作标记
        //得分
        cache.scaleY = beerNow.pin('scaleY');
        if(cache.scaleY>1){
            cache.score++;
            //清除啤酒瓶，并添加新瓶子
            row.empty();
            addBeer = beerFunc.addBeer(beer);
            beerNow = addBeer.element;
            beerNow.pin({
                scaleX : 1,
                scaleY : 1
            }).appendTo(row);
        }
        scoreString.setValue("Score:"+cache.score);
        //恢复原始状态，动画
        cache.beerElementList[addBeer.index-1].tween(duration = 100, delay = 0).clear().pin({
            scaleX : 1,
            scaleY : 1,
            pivotY:1
        }).then(function(){
        });
    });
});

/*texture*/
var PPU = 64;
Cut.addTexture(texture = {
    name : 'beerbottle',
    imagePath : '/img/wine/beers.png',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : 'beer1',
            x : 0,
            y : -200,
            width : 450,
            height : 750,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : 'beer2',
            x : 450,
            y : -200,
            width : 450,
            height : 750,
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        },
        {
            name : 'beer3',
            x : 900,
            y : -200,
            width : 450,
            height : 750,
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
            console.log(d);
            return Cut.Out.drawing("d_" + d, 12, 24, 10, function(ctx, ratio) {
//                ratio = 3;
                console.log(ratio);
                console.log('text----------------------');
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