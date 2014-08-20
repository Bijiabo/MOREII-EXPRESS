/**
 * Created by boooo on 14-8-21.
 */
var cache = {
    score:0,
    imageElement:{}
};

Cut(function(root, container) {
    Cut.Mouse(root, container, true);
    root.viewbox(360, 720);
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


    //绘制酒瓶
    var last = null;
    var colors = [ "green", "blue", "purple", "red", "orange", "yellow" ];

    var row = Cut.row(0.5).appendTo(root).pin("align", 0.5).spacing(1);
//    var row = Cut.create().appendTo(root);
    for (var i = 0; i < colors.length; i++) {
        Cut.image("beer:test").pin({
            scaleMode:'in',
            scaleWidth:100,
            scaleHeight:100
        }).appendTo(row).on(
            Cut.Mouse.MOVE, function(ev, point) {
                if (this != last) {
                    last = this;
                    this.tween().clear().pin({
                        scaleX : Cut.Math.random(0.8, 1.6),
                        scaleY : Cut.Math.random(0.8, 1.6)
                    });
                }
                return true;
            });
    }
});

/*texture*/
var PPU = 64;
Cut.addTexture(texture = {
    name : 'beer',
    imagePath : '/img/wine/lab.png',
    imageRatio : 1,
    cutouts : [
        { // list of cutoutDefs or cutouts
            name : 'test',
            x : 0,
            y : 0,
            width : 305,
            height : 305,
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
                console.log(ratio);
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