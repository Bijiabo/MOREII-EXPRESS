/**
 * Created by boooo on 14-6-9.
 */
var mobile = {
    cache:{
        setTimeoutId:{},
        canvas:{},
        color:{},
        window:{},
        image:[],
        imageLoadCount:0,
        imageLoaded:false
    },
    mobile:{
        Android: function() {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        }
    },
    color:[
        'hsl(29,100%,97.65%)',
        'hsl(18,100%,89.41%)',
        'hsl(39,100%,97.65%)',
        'hsl(148,70.20%,94.90%)',
    ],
    refreshCacheWindow:function(){
        mobile.cache.window.height= $(document).height();
        mobile.cache.window.width = $(document).width();
    },
    loadImage2cache:function(){
        var allCount = 5;
        for(var i=0;i<allCount;i++){
            mobile.cache.image.push(new Image());
            mobile.cache.image[i].src = siteUrl+'img/mobile/robot/'+i+'.svg';
            mobile.cache.image[i].onload = function(){
                mobile.cache.imageLoadCount++;
                if(mobile.cache.imageLoadCount>=allCount){
                    mobile.cache.imageLoaded = true;
                    setTimeout(function(){
                        $('#mobile-loading').fadeOut();
                    },2000);
                }
            }
        }
    },
    random:function (Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    },
    shakeAni:function(){
        $('#crack').show();
        setTimeout(function(){
            $('#mobile').css({
                'background':'hsl('+mobile.random(0,360)+',100%,50%)'
            });
        },500);
        setTimeout(function(){
            $('#crack').hide();
        },1000);
    },
    resetCrackCss:function(){
        var windowHeight = $(document).height();
        var windowWidth = $(document).width();
        if(windowHeight>=windowWidth){
            var size = windowHeight;
        }else{
            var size = windowWidth;
        }
        size *=2;
        $('#crack').css({
            'top':windowHeight/2+'px',
            'left':windowWidth/2+'px',
            'margin-left':'-'+size/2+'px',
            'margin-top':'-'+size/2+'px',
            'width':size+'px',
            'height':size+'px'
        });
    },
    initCanvas:function(){
        $('#crack-canvas,#bg-canvas').attr({
            width:mobile.cache.window.width,
            height:mobile.cache.window.height
        });
        mobile.cache.canvas.crackCanvas = document.getElementById('crack-canvas');
        mobile.cache.canvas.crackContext= mobile.cache.canvas.crackCanvas.getContext('2d');
        mobile.cache.canvas.bgCanvas = document.getElementById('bg-canvas');
        mobile.cache.canvas.bgContext= mobile.cache.canvas.bgCanvas.getContext('2d');
        $('#crack-canvas').css({
            'margin-left':'-'+mobile.cache.window.width/2+'px',
            'margin-top':'-'+mobile.cache.window.height/2+'px'
        });
        var shakeImage = new Image();
        shakeImage.src = siteUrl+'img/shake.png';
        shakeImage.onload = function(){
            mobile.cache.canvas.crackContext.drawImage(shakeImage,mobile.cache.window.width/2-193/2,mobile.cache.window.height/2-194/2);
            mobile.cache.canvas.bgContext.drawImage(shakeImage,mobile.cache.window.width/2-193/2,mobile.cache.window.height/2-194/2);
        }
    },
    crack:{
        animating:false,
        show:function(){
            $('#crack').show();
        },
        hide:function(){
            $('#crack').hide();
        },
        refresh:function(){
            if(!mobile.crack.animating){
                mobile.crack.animating = true;
                $('#mobile-bg').css({
                    'background':$('#crack').css('background')
                });
                mobile.crack.hide();
                $('#crack').removeAttr('style');
                mobile.resetCrackCss();
                mobile.cache.color.background = mobile.color[mobile.random(0,mobile.color.length-1)];
                /*copy crackCanvas to bgCanvas*/
//                var canvasData = mobile.cache.canvas.crackCanvas.toDataURL("image/png");
                mobile.cache.canvas.bgContext.drawImage(mobile.cache.canvas.crackCanvas,0,0);
                /*draw canvas background*/
                mobile.cache.canvas.crackContext.fillStyle = mobile.cache.color.background;
                mobile.cache.canvas.crackContext.fillRect(0,0,mobile.cache.window.width,mobile.cache.window.height);
                var randomImageIndex = mobile.random(0,4);
                var drawHeight = mobile.cache.window.height - 60;
                var drawWidth = mobile.cache.image[randomImageIndex].width * drawHeight / mobile.cache.image[randomImageIndex].height;
                var drawX = mobile.cache.window.width/2 - drawWidth/2;
                var drawY = 30;
                mobile.cache.canvas.crackContext.drawImage(mobile.cache.image[randomImageIndex], drawX , drawY , drawWidth , drawHeight);
//                mobile.cache.canvas.bgContext.drawImage(mobile.cache.image[randomImageIndex], drawX , drawY , drawWidth , drawHeight);
                $('#crack-canvas').hide();
                $('#crack').css({
//                    'background':'hsl('+mobile.random(0,360)+',100%,80%)'
                    'background':mobile.cache.color.background
                });
                mobile.crack.show();
                /*show canvas drawing elements*/
                mobile.cache.setTimeoutId.canvas = setTimeout(function(){
                    $('#crack-canvas').fadeIn();
                },1000);
                mobile.cache.setTimeoutId.animating = setTimeout(function(){
                    mobile.crack.animating = false;
                },2000);
            }
        }
    },
    canvasId:'draw',
    drawCircle:function(){
        var canvas = document.getElementById(mobile.canvasId),
            context= canvas.getContext('2d');
//        context.translate($(document).width()/2,$(document).height()/2);
        context.lineJoin = 'round';
        context.lineWidth = 10;
        context.fillStyle = 'hsl(90,50%,50%)';
//        context.rotate(0);
        var width = $(document).width();
        var height= $(document).height();
        for(var w=-width*1.5;w<width+50;w+=25){
            for(var i=-50;i<90;i++){
                context.setTransform(1,0,0,1,25*i+w,25*i);
                context.rotate(Math.PI/3);
                context.fillStyle = 'hsl('+mobile.random(80,100)+',50%,50%)';
                context.fillRect(0,0,50,50);

            }
        }
    },
    resizeCanvas:function(){
        $('#'+mobile.canvasId).attr({
            width:$(document).width(),
            height:$(document).height()
        });
    }
}; //声明命名空间
mobile.shake =(function(){
    //全局常量
    this._SwingThreshold = 2000;		//甩动速度临界点
    this._SimpleInterval = 100;		//采样间隔时间

    //全局变量
    this._isIOS = mobile.mobile.iOS();		//safari on iOS
    this._isAndroid  = mobile.mobile.Android();	//browsers on Android
    this._lastTime = 0;		//上次采样时间点
    this._lastX = 0;		//上次采样X方向值
    this._lastY = 0;		//上次采样Y方向值
    this._lastZ = 0;		//上次采样Z方向值
    //构造函数
    return function(){
        //监听页面load事件
        window.addEventListener("load",this.windowLoadHandler,false);
    }
})();

mobile.shake.prototype ={
    /* 此处省略n行代码 。。。 */
    devicemotionHandler : function(evt) {	//事件处理
        if(evt.accelerationIncludingGravity){	//获取重力加速度坐标
            var x = event.accelerationIncludingGravity.x,
                y = event.accelerationIncludingGravity.y,
                z = event.accelerationIncludingGravity.z;
            if(_isAndroid){ //处理Android平台
                x = -x;
                y = -y;
                z = -z;
            }
        }
        //判断是否达到采样间隔
        var curTime = (new Date()).getTime();
        if(curTime - _lastTime > _SimpleInterval){
            var timeGap = curTime - _lastTime;
            _lastTime = curTime;
            //判断是否达到甩动速度
            var speed = Math.abs(x + y + z - _lastX - _lastY - _lastZ) / timeGap * 10000;
            /*$('#console').text(Math.floor(speed));
            if(Number($('#console-max').text())<speed){
                $('#console-max').text(Math.floor(speed));
            }*/
            if(speed > _SwingThreshold && z < -9){
                var absGap = Math.abs(x) - Math.abs(_lastX);
                var direction = "R";
                if(x < -1){	//R2L，从右甩向左
                    direction = "R";
                }
                if(x > 1){	//L2R，从左甩向右
                    direction = "L";
                }
                //把direction等信息通知服务器，此处代码省略
                /*
                 。。。。。。
                 */
                mobile.crack.refresh();
            }
            //记录本次采样的坐标
            _lastX = x;
            _lastY = y;
            _lastZ = z;
        }
    },
    windowLoadHandler : function(evt) {
        //监听运动传感器事件
        window.addEventListener('devicemotion',fsChr.devicemotionHandler, false);
    }
    /* 。。。此处省略n行代码 */
};

//声明并初始化对象
var fsChr = new mobile.shake();

$(function(){
    mobile.loadImage2cache();
    mobile.refreshCacheWindow();
    mobile.resetCrackCss();
    mobile.initCanvas();
    $('#crack').show();
    $(document).on('click','#mobile-btn-refresh',function(){
        mobile.crack.refresh();
    });
    $(document).on('click','#mobile-btn-reload',function(){
        window.location.reload();
    });
    $(document).on('click','#mobile-btn-download',function(){
        var canvasData = mobile.cache.canvas.crackCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href = canvasData;
    });
});