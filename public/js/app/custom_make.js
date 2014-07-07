/**
 * Created by boooo on 14-5-24.
 */
var MoreiiCustom = {
    resizeWall:function(){$('#wall').height($(window).height() - $('#headerbox').height());},
    resizeToolbar:function(){$('#toolbar').height($('#styleelementlist').height()+30)},
    cache:{
        mouseState:{
            addElement:false,
            moveElement:false,
            selectedElement:false,
            resizePreviewRoom:false
        },
        groupCount:0,
        getGroup:function(){
            MoreiiCustom.cache.groupCount++;
            return MoreiiCustom.cache.groupCount;
        },
        elementSrc:false,
        elementWidth:0,
        elementHeight:0,
        elementTop:0,
        elementLeft:0,
        ePageX2elementTop:0,
        ePageY2elementLeft:0,
        activeElement:null,
        image:{},
        backgroundColor:'#ffffff',
        resize:{
            width:10,
            height:10,
            unit:'cm'
        }
    },
    loadImage2Cache:function(){
        var images = $('#styleelementlist img');
        var count = images.length;
        MoreiiCustom.cache.imageLoaded = 0;
        $.each(images,function(index,item){
            var imageUrl = $(item).attr('src');
            var series = imageUrl.match(/(\w+)\/\w+\.\w+$/);
            if(series){
                series = series[1];
            }
            var filename = 'mii_'+imageUrl.match(/\w+\.\w+$/)[0].replace('.','_');
            if(!MoreiiCustom.cache.image[series]){
                MoreiiCustom.cache.image[series] = {};
            }
            MoreiiCustom.cache.image[series][filename] = new Image();
            MoreiiCustom.cache.image[series][filename].src = imageUrl;
            MoreiiCustom.cache.image[series][filename].imageIndex = index;
            MoreiiCustom.cache.image[series][filename].onload = function(e){
                MoreiiCustom.cache.imageLoaded++;
                var present = Math.round(1/count*95) +  Number($('#loading-number').text());
                if(present>=100 || MoreiiCustom.cache.imageLoaded === count) {
                    $('#loading').fadeOut();
                }else{
                    $('#loading-number').text(' '+present);
                    $('#loading-progress-bar').css('width',present+'%');
                }
            }
        });
    },
    resizeBgcolorItem:function(){
        var height = $('#panel').height()-70;
        $('.bgcoloritem').height(height).width(height);
    },
    previewRoom:function(w,h){
        $('#previewroom-loading').show();
        //set wallpaper cell size
        if(w!==undefined && h!==undefined){
            var dw = Math.round(4.025 * Number(w)),//this unit is cm =_=
                dh = Math.round(4.025 * Number(h));
        }else{
            var dw = Math.round(4.025 * 20),
                dh = Math.round(4.025 * 20);
        }
        var custombg = document.getElementById('redrawcanvas'),
            custombgContext= custombg.getContext('2d');
        var canvas = document.getElementById('previewroom-canvas'),
            context= canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        context.globalCompositeOperation='multiply';
        var ImageLoaded = 0;
        var ImageCache = {};
        ImageCache.front = new Image();
        ImageCache.front.src = siteUrl+'img/custom_previewroom/1/front.png';
        ImageCache.background = new Image();
        ImageCache.background.src = siteUrl+'img/custom_previewroom/1/background.png';
        var draw4previewroom =  function(){
            ImageLoaded++;
            if(ImageLoaded===2){
                $('#previewroom-loading').fadeOut();
                /**
                 * draw Images
                 * */
                context.drawImage(ImageCache.background,0,0);
                //draw custom wallpapers
                for(var x=0;x<canvas.width+dw;x=x+dw){
                    for(var y=0;y<canvas.height+dh;y=y+dh){
                        context.drawImage(custombg,x,y,dw,dh);
                    }
                }
//                context.drawImage(custombg,0,0);
                context.globalCompositeOperation='source-over';
                context.drawImage(ImageCache.front,0,0);
            }
        }
        ImageCache.front.onload = function(){
            draw4previewroom();
        }
        ImageCache.background.onload = function(){
            draw4previewroom();
        }
    },
    resizePreviewRoomCell:function(el,e){
        var bar = $('#previewroom-resize');
        var barPositionLeft = bar.offset().left;
        var persent = Math.round(Math.abs(e.pageX-barPositionLeft)/bar.width()*100);
        if(persent>0 && persent<100){
            $('#previewroom-resizehandle').css('left', persent+'%');
            bar.find('.progress-bar').css('width',persent+'%');
            var cellSize = Math.round(0.43*persent) + 10;
            MoreiiCustom.cache.resize = {
                width:cellSize,
                height:cellSize,
                unit:'cm'
            }
            MoreiiCustom.previewRoom(cellSize,cellSize);
        }
    },
    movePreviewRoomHandle:function(el,e){
        var bar = $('#previewroom-resize');
        var barPositionLeft = bar.offset().left;
        var persent = Math.round(Math.abs(e.pageX-barPositionLeft)/bar.width()*100);
        if(persent>0 && persent<100){
            $('#previewroom-resizehandle').css('left', persent+'%');
            bar.find('.progress-bar').css('width',persent+'%');
        }
    },
    buildCustomData:function(){
        var data = [];
        var canvasItems = $('#canvas>div');
        $.each(canvasItems,function(index,item){
            var el = $(item);
            data.push({
                top : clearCss(el.css('top')),
                left: clearCss(el.css('left')),
                width:el.width(),
                height:el.height(),
                img:el.find('img').attr('src')

            });
        });
        var drawData = {
            backgroundColor:MoreiiCustom.cache.backgroundColor,
            originalData:data,
            originalSize:{
                width:500,
                height:500,
                unit:'px'
            },
            resize:MoreiiCustom.cache.resize
        }
        return drawData;
    }
};
//var resizeToolbar = function(){$('#toolbar').height($(window).width() / 12)}
/*var cache = {
    mouseState:{
        addElement:false,
        moveElement:false,
        selectedElement:false
    },
    groupCount:0,
    getGroup:function(){
        cache.groupCount++;
        return cache.groupCount;
    },
    elementSrc:false,
    elementWidth:0,
    elementHeight:0,
    elementTop:0,
    elementLeft:0,
    ePageX2elementTop:0,
    ePageY2elementLeft:0,
    activeElement:null,
    image:{}
}*/
/*var loadImage2Cache = function(){
    var images = $('#styleelementlist img');
    var count = images.length;
    $.each(images,function(index,item){
        var imageUrl = $(item).attr('src');
        var series = imageUrl.match(/(\w+)\/\w+\.\w+$/);
        if(series){
            series = series[1];
        }
        var filename = 'mii_'+imageUrl.match(/\w+\.\w+$/)[0].replace('.','_');
        if(!MoreiiCustom.cache.image[series]){
            MoreiiCustom.cache.image[series] = {};
        }
        MoreiiCustom.cache.image[series][filename] = new Image();
        MoreiiCustom.cache.image[series][filename].src = imageUrl;
        MoreiiCustom.cache.image[series][filename].imageIndex = index;
        MoreiiCustom.cache.image[series][filename].onload = function(e){
            var present = Math.round(1/count*95) +  Number($('#loading-number').text());
            if(present>=100){
                $('#loading').fadeOut();
            }else{
                $('#loading-number').text(' '+present);
                $('#loading-progress-bar').css('width',present+'%');
            }
        }
    });
}*/
var mouseState = {
    addElement:function(state){
        if(state !== undefined){
            MoreiiCustom.cache.mouseState.addElement = Boolean(state);
            if(Boolean(state)){
                $('body').css('cursor','move');
            }else{
                $('body').css('cursor','auto');
            }
        }else{
            return MoreiiCustom.cache.mouseState.addElement;
        }
    },
    moveElement:function(state){
        if(state !== undefined){
            MoreiiCustom.cache.mouseState.moveElement = Boolean(state);
            if(Boolean(state)){
                $('body').css('cursor','move');
            }else{
                $('body').css('cursor','auto');
            }
        }else{
            return MoreiiCustom.cache.mouseState.moveElement;
        }
    },
    selectedElement:function(state) {
        if (state !== undefined) {
            MoreiiCustom.cache.mouseState.selectedElement = Boolean(state);
            //add resize part
            var resize = $('#resize');
            if(Boolean(state)){
                resize.css({
                    'top' :MoreiiCustom.cache.activeElement.offset().top+'px',
                    'left':MoreiiCustom.cache.activeElement.offset().left+'px',
                    'height':MoreiiCustom.cache.activeElement.css('height'),
                    'width':MoreiiCustom.cache.activeElement.css('width'),
                    'display':'block'
                });
            }else{
                resize.hide();
            }
        } else {
            return MoreiiCustom.cache.mouseState.selectedElement;
        }
    },
    resize3:false
};
var dragElementFromStylelist = function(e){
    var img = $('#addElement img');
    MoreiiCustom.cache.elementWidth = img.width();
    MoreiiCustom.cache.elementHeight = img.height();
    MoreiiCustom.cache.elementTop = e.pageY - MoreiiCustom.cache.elementHeight/2;
    MoreiiCustom.cache.elementLeft =  e.pageX - MoreiiCustom.cache.elementWidth/2;
    $('#addElement').css({
        top: MoreiiCustom.cache.elementTop,
        left:MoreiiCustom.cache.elementLeft
    });
}
/**
 * 刷新resize视图
 * */
var refreshResize = function(){
   $('#resize').css({
        'top' :MoreiiCustom.cache.activeElement.offset().top+'px',
        'left':MoreiiCustom.cache.activeElement.offset().left+'px',
        'height':MoreiiCustom.cache.activeElement.css('height'),
        'width':MoreiiCustom.cache.activeElement.css('width'),
        'display':'block'
   });
}
/**
 * 去除css单位
 * */
var clearCss = function(x){
    return Number(String(x).replace('px',''));
}
/**
 * 检测鼠标是否在元素上方
 * */
var overElement = function(e,element){
    if(e.pageX>element.offset().left && e.pageX<(element.offset().left+element.width()) && e.pageY>element.offset().top && e.pageY <(element.offset().top+element.height())){
        return true;
    }else{
        return false;
    }
}
/**
 * 刷新element cache
 * */
var refreshElementCache = function(){
    MoreiiCustom.cache.elementHeight = MoreiiCustom.cache.activeElement.height();
    MoreiiCustom.cache.elementWidth = MoreiiCustom.cache.activeElement.width();
    MoreiiCustom.cache.elementTop = clearCss(MoreiiCustom.cache.activeElement.css('top'));
    MoreiiCustom.cache.elementLeft = clearCss(MoreiiCustom.cache.activeElement.css('left'));
}
/**
 * 检测边缘
 * */
var checkEdge = function(element,parent){
    var top = clearCss(element.css('top'));
    var left = clearCss(element.css('left'));
    var parentWidth = parent.width();
    var parentHeight = parent.height();
    if( top<0 || left<0 || top>parentHeight-MoreiiCustom.cache.elementHeight || left>parentWidth-MoreiiCustom.cache.elementWidth ){//out if parent's edges
        if(element.attr('data-group') === undefined){
            element.attr('data-group',MoreiiCustom.cache.getGroup());
        }else{
            var groupNumber = element.attr('data-group');
            var htmlCache = $('#canvas>div[data-group='+groupNumber+']').get(0);
            var groupElement = $('#canvas>div[data-group='+groupNumber+']');
            var groupElementCount = groupElement.length;
            for(var i=0;i<groupElementCount;i++){
                if(element.get(0)!==groupElement.get(i)){
                    $(groupElement.get(i)).remove();
                }
            }
        }
//        parent.append(element.clone(true));
        if(left<0){
            if(top<0){
                var rightTop = element.clone(true);
                rightTop.css({
                    top:top+'px',
                    left:(parentWidth+left)+'px'
                });
                parent.append(rightTop);

                var rightBottom = element.clone(true);
                rightBottom.css({
                    top:(parentHeight+top)+'px',
                    left:(parentWidth+left)+'px'
                });
                parent.append(rightBottom);

                var leftBottom = element.clone(true);
                leftBottom.css({
                    top:(parentHeight+top)+'px',
                    left:left+'px'
                });
                parent.append(leftBottom);
            }else if(top<parentHeight-MoreiiCustom.cache.elementHeight){
                var right = element.clone(true);
                right.css({
                    top:top+'px',
                    left:(parentWidth+left)+'px'
                });
                parent.append(right);
            }else{
                var rightTop = element.clone(true);
                rightTop.css({
                    top:(top-parentHeight)+'px',
                    left:(parentWidth+left)+'px'
                });
                parent.append(rightTop);

                var rightBottom = element.clone(true);
                rightBottom.css({
                    top:top+'px',
                    left:(parentWidth+left)+'px'
                });
                parent.append(rightBottom);

                var leftTop = element.clone(true);
                leftTop.css({
                    top:(top-parentHeight)+'px',
                    left:left+'px'
                });
                parent.append(leftTop);
            }
        }else if(left < (parentWidth-MoreiiCustom.cache.elementWidth)){
            if(top<0){
                var bottom = element.clone(true);
                bottom.css({
                    top:(top+parentHeight)+'px',
                    left:left+'px'
                });
                parent.append(bottom);
            }else if(top>parentHeight-MoreiiCustom.cache.elementHeight){
                var topel = element.clone(true);
                topel.css({
                    top:(top-parentHeight)+'px',
                    left:left+'px'
                });
                parent.append(topel);
            }
        }else{
            if(top<0){
                var leftTop = element.clone(true);
                leftTop.css({
                    top:top+'px',
                    left:(left-parentWidth)+'px'
                });
                parent.append(leftTop);

                var rightBottom = element.clone(true);
                rightBottom.css({
                    top:(top+parentHeight)+'px',
                    left:left+'px'
                });
                parent.append(rightBottom);

                var leftBottom = element.clone(true);
                leftBottom.css({
                    top:(top+parentHeight)+'px',
                    left:(left-parentWidth)+'px'
                });
                parent.append(leftBottom);
            }else if(top<parentHeight-MoreiiCustom.cache.elementHeight){
                var leftel = element.clone(true);
                leftel.css({
                    top:top+'px',
                    left:(left-parentWidth)+'px'
                });
                parent.append(leftel);
            }else{
                var leftTop = element.clone(true);
                leftTop.css({
                    top:(top-parentHeight)+'px',
                    left:(left-parentWidth)+'px'
                });
                parent.append(leftTop);

                var rightTop = element.clone(true);
                rightTop.css({
                    top:(top-parentHeight)+'px',
                    left:(left)+'px'
                });
                parent.append(rightTop);

                var leftBottom = element.clone(true);
                leftBottom.css({
                    top:top+'px',
                    left:(left-parentWidth)+'px'
                });
                parent.append(leftBottom);

            }
        }
    }else{//in parent area
        var groupNumber = element.attr('data-group');
        if(groupNumber!==undefined){
            var htmlCache = $('#canvas>div[data-group='+groupNumber+']').get(0);
            var groupElement = $('#canvas>div[data-group='+groupNumber+']');
            var groupElementCount = groupElement.length;
            for(var i=0;i<groupElementCount;i++){
                if(element.get(0)!==groupElement.get(i)){
                    $(groupElement.get(i)).remove();
                }
            }
//            $('#canvas>div[data-group='+groupNumber+']:gt(0)').remove();
//            canvas.append(htmlCache);
        }
    }
}
/**
 * 更新#wall背景
 * */
var refreshWall = function(){
    /*html2canvas($('#canvas'), {
        onrendered: function(canvas) {
            var bgPositionLeft = $('#canvas').offset().left%500;
            $('#wall').css({
                'background':'url('+canvas.toDataURL("image/png")+')',
                'background-position':bgPositionLeft+'px '+($('#canvas').offset().top+20)+'px'
            });
        }
    });*/
    reDraw();
}
/**
 * 生成绘制数据
 * */
var buildCustomData = function(){
    var data = [];
    var canvasItems = $('#canvas>div');
    $.each(canvasItems,function(index,item){
        var el = $(item);
        data.push({
            top : clearCss(el.css('top')),
            left: clearCss(el.css('left')),
            width:el.width(),
            height:el.height(),
            img:el.find('img').attr('src')

        });
    });
    return data;
}
/**
 * 重绘canvas图像 用于背景和后期生成
 * */
var reDraw = function(){
    var canvas = document.getElementById('redrawcanvas'),
        context= canvas.getContext('2d');
//    context.globalCompositeOperation='multiply';
    context.clearRect(0,0,500,500);
    context.fillStyle = MoreiiCustom.cache.backgroundColor;
    context.fillRect(0,0,500,500);
    var data = buildCustomData();
    for(var i=0;i<data.length;i++){
        var imageUrl = data[i].img;
        var series = imageUrl.match(/(\w+)\/\w+\.\w+$/);
        if(series){
            series = series[1];
        }
        var filename = 'mii_'+imageUrl.match(/\w+\.\w+$/)[0].replace('.','_');
        context.drawImage(MoreiiCustom.cache.image[series][filename],data[i].left,data[i].top,data[i].width,MoreiiCustom.cache.image[series][filename].height*data[i].width/MoreiiCustom.cache.image[series][filename].width);
    }
    var data2url = canvas.toDataURL("image/png");
    var bgPositionLeft = $('#canvas').offset().left%500;
    $('#wall').css({
        'background':'url('+data2url+')',
        'background-position':bgPositionLeft+'px '+($('#canvas').offset().top+20)+'px'
    });

}
/*
* 导出打印尺寸
* */
var reDraw4print = function(){
    $('#uploaddatatitle').text('生成数据');
    $('#uploaddata-bar').css('width','10%').attr('aria-valuenow','10');

    var canvas = document.createElement('canvas'),
        context= canvas.getContext('2d'),
        paperCanvas = document.createElement('canvas'),
        paperContext = paperCanvas.getContext('2d'),
        originalSize = 500;
    var size = 10 * 1;//cm
    var size2px = size / 2.54 * 300;
    var paper = {
        width:10, //dm
        height:10 //dm
    };
    paperCanvas.width = paper.width / 2.54 * 300 *10;
    paperCanvas.height= paper.height / 2.54 * 300 *10;
    canvas.width = size2px;
    canvas.height= size2px;
//    context.fillStyle = '#ffffff';
//    context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle = MoreiiCustom.cache.backgroundColor;
    context.fillRect(0,0,canvas.width,canvas.height);
    var scale = size2px/originalSize;
    var data = buildCustomData();
    for(var i=0;i<data.length;i++){
        var imageUrl = data[i].img;
        var series = imageUrl.match(/(\w+)\/\w+\.\w+$/);
        if(series){
            series = series[1];
        }
        var filename = 'mii_'+imageUrl.match(/\w+\.\w+$/)[0].replace('.','_');
        var x = data[i].left*scale;
        var y = data[i].top*scale;
        var scaleWidth = data[i].width*scale;
        var scaleHeight= MoreiiCustom.cache.image[series][filename].height*data[i].width/MoreiiCustom.cache.image[series][filename].width*scale;
        context.drawImage(MoreiiCustom.cache.image[series][filename],x,y,scaleWidth,scaleHeight);
    }
    for(var i=0;i<paper.width;i++){
        for(var j=0;j<paper.height;j++){
            paperContext.drawImage(canvas,i*size/ 2.54 * 300 ,j*size/ 2.54 * 300 );
        }
    }

    $('#uploaddatatitle').text('存储数据');
    $('#uploaddata-bar').css('width','60%').attr('aria-valuenow','60');

//    var data2url = paperCanvas.toDataURL("image/png");
//    var save = data2url.replace("image/png", "image/octet-stream");
//    window.location.href = save;
//    window.location.href = paperCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//    return data2url;

    $.ajax({
        type: "POST",
        url: '/api/custom/build4print',
        data: {
            imgData:paperCanvas.toDataURL("image/png")
        },
        success: function(data){
//            console.log(data);
            if(data.err===null){
                $('#uploaddata').modal('show');
                $('#uploaddatatitle').text('完成');
                $('#uploaddata-bar').css('width','100%').attr('aria-valuenow','100');
                $('#picturenumber').html('<p>存储编号为：'+data.fileName.replace('_out.png','')+'</p>').fadeIn();
            }else{
                alert('出错了亲。。。');
            }
        },
        dataType: 'json'
    });
}

$(function(){
    MoreiiCustom.loadImage2Cache();
    var canvas = $('#canvas');
    MoreiiCustom.resizeWall();
    setTimeout(function(){
        MoreiiCustom.resizeToolbar();
    },500);
    $(window).on('resize',function(){
        MoreiiCustom.resizeWall();
        MoreiiCustom.resizeToolbar();
    });
    $('#styleelementlist').slick({
        auto:true,
        slidesToShow: 15,
        slidesToScroll: 10
    });
    $(document).on('mousemove',function(e){
        e.preventDefault();
        switch(true){
            case mouseState.addElement():
                dragElementFromStylelist(e);
                if(overElement(e,canvas)){
                    canvas.addClass('active');
                }else{
                    canvas.removeClass('active');
                }
                break;
            case mouseState.moveElement():
                MoreiiCustom.cache.activeElement.css({
                    top: (e.pageY - MoreiiCustom.cache.ePageX2elementTop) + 'px',
                    left:(e.pageX - MoreiiCustom.cache.ePageY2elementLeft)+ 'px'
                });
                reDraw();
                break;
            case mouseState.resize === 3:
                var width = e.pageX - MoreiiCustom.cache.activeElement.offset().left;
                var height= e.pageY - MoreiiCustom.cache.activeElement.offset().top;
                var widthOriginal = clearCss(MoreiiCustom.cache.activeElement.css('width'));
                var heightOriginal= clearCss(MoreiiCustom.cache.activeElement.css('height'));
                var scale = 1;
                if(width>0 && height>0){
                    if(width > widthOriginal){
                        if(height > heightOriginal){//bigger
                            if(width/widthOriginal > height/heightOriginal){
                                scale = height/heightOriginal;
                                width = widthOriginal*scale;
                                MoreiiCustom.cache.activeElement.css({
                                    'width':width+'px'
                                });
                                $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                            }else{
                                scale = width/widthOriginal;
                                height = heightOriginal*scale;
                                MoreiiCustom.cache.activeElement.css({
                                    'width':width+'px'
                                });
                                $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                            }
                        }
                    }else{
                        if(height < heightOriginal){//smaller
                            if(width/widthOriginal < height/heightOriginal){
                                scale = height/heightOriginal;
                                width = widthOriginal*scale;
                                MoreiiCustom.cache.activeElement.css({
                                    'width':width+'px'
                                });
                                $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                            }else{
                                scale = width/widthOriginal;
                                height = heightOriginal*scale;
                                MoreiiCustom.cache.activeElement.css({
                                    'width':width+'px'
                                });
                                $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                            }
                        }
                    }
                    refreshResize();
                    refreshElementCache();
                    checkEdge(MoreiiCustom.cache.activeElement,canvas);
                }
                break;
            case mouseState.resize === 4:
                var width = MoreiiCustom.cache.activeElement.offset().left - e.pageX + clearCss(MoreiiCustom.cache.activeElement.css('width')); //console.log(width);
                var height= e.pageY - MoreiiCustom.cache.activeElement.offset().top; //console.log(height);
                var widthOriginal = clearCss(MoreiiCustom.cache.activeElement.css('width'));
                var heightOriginal= clearCss(MoreiiCustom.cache.activeElement.css('height'));
                var scale = 1;
                if(width>0 && height>0){
                    if(width>widthOriginal && height>heightOriginal){//bigger
                        if(width/widthOriginal > height/heightOriginal){
                            scale = height/heightOriginal;
                            width = heightOriginal*scale;
                            var left = clearCss(MoreiiCustom.cache.activeElement.css('left')) -width +widthOriginal;
                            MoreiiCustom.cache.activeElement.css({
                                'width':width+'px',
                                'left':left+'px'
                            });
                            $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                        }else{
                            var left = clearCss(MoreiiCustom.cache.activeElement.css('left')) -width+widthOriginal;
                            MoreiiCustom.cache.activeElement.css({
                                'width':width+'px',
                                'left':left+'px'
                            });
                            $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                        }
                    }else if(width<widthOriginal && height<heightOriginal){
                        if(width/widthOriginal < height/heightOriginal){
                            scale = height/heightOriginal;
                            width = heightOriginal*scale;
                            var left = clearCss(MoreiiCustom.cache.activeElement.css('left')) -width +widthOriginal;
                            MoreiiCustom.cache.activeElement.css({
                                'width':width+'px',
                                'left':left+'px'
                            });
                            $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                        }else{
                            var left = clearCss(MoreiiCustom.cache.activeElement.css('left')) -width+widthOriginal;
                            MoreiiCustom.cache.activeElement.css({
                                'width':width+'px',
                                'left':left+'px'
                            });
                            $(MoreiiCustom.cache.activeElement.find('img')).css('width','100%');
                        }
                    }
                    refreshResize();
                    refreshElementCache();
                    checkEdge(MoreiiCustom.cache.activeElement,canvas);
                }
                break;
            case MoreiiCustom.cache.mouseState.resizePreviewRoom:
                MoreiiCustom.movePreviewRoomHandle($(this),e);
                break;
            default :
                break;
        }
    });
    $(document).on('mousedown','#styleelementlist .shadow',function(e){
        if(e.which === 1){
            mouseState.addElement(true);
            MoreiiCustom.cache.elementSrc = $($($(this).siblings('.img')).find('img')).attr('src');
            $('#addElement').remove();
            $('body').append('<div id="addElement"><img src="'+MoreiiCustom.cache.elementSrc+'"/></div>');
        }
    });
    $(document).on('mouseup',function(e){
        if(e.which === 1){
            switch (true){
                case mouseState.addElement():
                    if(overElement(e,canvas)){
                        var top = MoreiiCustom.cache.elementTop - canvas.offset().top;
                        var left= MoreiiCustom.cache.elementLeft- canvas.offset().left;
                        canvas.append('<div style="top:'+top+'px;left:'+left+'px "><img src="'+MoreiiCustom.cache.elementSrc+'"/></div>');
                        checkEdge($('#canvas>div:last'),canvas);
                        MoreiiCustom.cache.activeElement = $('#canvas>div:last');
                        MoreiiCustom.cache.activeElement.find('img')[0].onload = function(){
                            mouseState.selectedElement(true);
                        }

                        refreshWall();
                    }
                    mouseState.addElement(false);
                    $('#addElement').remove();
                    canvas.removeClass('active');
                    break;
                case mouseState.moveElement():
                    mouseState.moveElement(false);
                    checkEdge(MoreiiCustom.cache.activeElement,canvas);
                    refreshWall();
                    window.setTimeout(function(){
                        mouseState.selectedElement(true);
                    },100);
                    break;
                case mouseState.resize !== false:
                    mouseState.resize = false;
                    refreshWall();
                    break;
                case MoreiiCustom.cache.mouseState.resizePreviewRoom:
                    MoreiiCustom.resizePreviewRoomCell($(this),e);
                    MoreiiCustom.cache.mouseState.resizePreviewRoom = false;
                    break;
                default :
                    break;
            }
        }
    });
    /**
     * canvas listen
     * */
    $(document).on('mouseenter','#canvas',function(){
    });
    $(document).on('mouseleave','#canvas',function(){
        if(mouseState.addElement()){
        }
    });
    /*$(document).on('mouseup','#canvas',function(){

    });*/
    $(document).on('mousedown','#canvas>div,#resize-0',function(e){
        if(e.which === 1){
            $('#contextmenu').hide();
            mouseState.moveElement(true);
            if($(this).attr('id') === 'resize-0'){
                var el = MoreiiCustom.cache.activeElement;
            }else{
                var el = $(this);
                MoreiiCustom.cache.activeElement = el;
            }
            MoreiiCustom.cache.elementTop = clearCss(el.css('top'));
            MoreiiCustom.cache.elementLeft= clearCss(el.css('left'));
            MoreiiCustom.cache.ePageX2elementTop = e.pageY - MoreiiCustom.cache.elementTop;
            MoreiiCustom.cache.ePageY2elementLeft= e.pageX - MoreiiCustom.cache.elementLeft;
            mouseState.selectedElement(false);
        }else if(e.which===3) {//right button
            if($(this).attr('id') !== 'resize-0'){
                MoreiiCustom.cache.activeElement = $(this);
                refreshResize();
            }
            $('#contextmenu').css({
                'top': e.pageY + 'px',
                'left': e.pageX + 'px',
            }).show();
        }
        if(e && e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
        return false;
    });
    /**
     * preview
     * */
    $(document).on('click','#previewbutton',function(e){
        if(e.which === 1){
            if($(this).hasClass('active')){
                $('#preview').fadeOut();
                $(this).removeClass('active');
            }else{
                var backgroundImageData = $('#wall').css('background-image');
                var backgroundPosition = $('#wall').css('background-position');
                var preview = $('#preview');
                preview.css({
                    'background-image':backgroundImageData,
                    'background-position': $('#canvas').offset().left%500+'px '+ ($('#canvas').offset().top)+'px'
                });
                preview.fadeIn();
                $(this).addClass('active');
            }
        }
    });
    /*$(document).on('click','#closepreview',function(e){
        if(e.which === 1){
            $('#preview').fadeOut();
        }
    });*/
    /*resize*/
    $(document).on('mousedown','#resize-1',function(e){
        if(e.which === 1){
            mouseState.resize = 1;
        }
    });
    $(document).on('mousedown','#resize-2',function(e){
        if(e.which === 1){
            mouseState.resize = 2;
        }
    });
    $(document).on('mousedown','#resize-3',function(e){
        if(e.which === 1){
            mouseState.resize = 3;
        }
    });
    $(document).on('mousedown','#resize-4',function(e){
        if(e.which === 1){
            mouseState.resize = 4;
            console.log('set 4');
        }
    });
    /**
     * deselection
     * */
    $(document).on('click','#wall',function(e){
        if(e.which === 1){
            if(mouseState.selectedElement()){
                mouseState.selectedElement(false);
            }
        }
    });
    /**
     * select toolbar panel
     * */
    $(document).on('click','#toolbar #tab .tabitem',function(){

        var id = $(this).attr('id');
        $('#toolbar #tab .tabitem').removeClass('active');
        $(this).addClass('active');
        $('#toolbar #panel>div').hide();
        switch(id){
           case 'elementList':
               $('#styleelementlist').show();
               break;
           case 'setbackgroundcolor':
               var backgroundcolorPanel = $('#backgroundcolor');
               var height = $('#panel').height()-70;
               $('.bgcoloritem').height(height).width(height);
               backgroundcolorPanel.show();
               break;
           default :
               break;
        }
    });
    /*
    * pick background color
    * */
    $(document).on('click','.bgcoloritem',function(){
        $('#backgroundcolor .bgcoloritem').removeClass('active');
        $(this).addClass('active');
        var colorCode = $(this).css('background-color');
        MoreiiCustom.cache.backgroundColor = colorCode;
        canvas.css('background-color',colorCode);

        refreshWall();
    });
    /**
     * unable context menu
     * */
    $(document).bind("contextmenu",function(e){
        return false;
    });
    /**
     * listen context menu
     * */
    $(document).on('mousedown','#contextmenu ul li',function(e){
//        alert('click menu!');
        var miido= $(this).data('miido');
        switch(miido){
            case 'delete':
                var removeElement = MoreiiCustom.cache.activeElement;
                removeElement.remove();
                MoreiiCustom.cache.activeElement = $('#canvas>div:last');
                reDraw();
                break;
            case 'up':
                var moveElement = MoreiiCustom.cache.activeElement.clone(true);
                var moveElementIndex = MoreiiCustom.cache.activeElement.index();
                console.log(moveElementIndex);
                var removeElement = MoreiiCustom.cache.activeElement;
                removeElement.remove();
                if($('#canvas>div').get(moveElementIndex) !== undefined){
                    moveElement.insertAfter('#canvas>div:eq('+(moveElementIndex)+')');
                    MoreiiCustom.cache.activeElement = $('#canvas>div:eq('+(moveElementIndex+1)+')');
                }else{
                    $('#canvas').append(moveElement);
                    MoreiiCustom.cache.activeElement = $('#canvas>div:last');
                }
                break;
            case 'down':
                var moveElement = MoreiiCustom.cache.activeElement.clone(true);
                var moveElementIndex = MoreiiCustom.cache.activeElement.index();
                console.log(moveElementIndex);
                var removeElement = MoreiiCustom.cache.activeElement;
                removeElement.remove();
                if($('#canvas>div').get(moveElementIndex-1) !== undefined){
                    moveElement.insertBefore('#canvas>div:eq('+(moveElementIndex-1)+')');
                    MoreiiCustom.cache.activeElement = $('#canvas>div:eq('+(moveElementIndex-2)+')');
                }else{
                    $('#canvas').prepend(moveElement);
                    MoreiiCustom.cache.activeElement = $('#canvas>div:eq(0)');
                }
                break;
        }
        $('#resize').hide();
        $('#contextmenu').hide();

        if(e && e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
        return false;
    });
      /**
     * hide context menu
     * */
    $(document).on('mousedown',function(e){
        $('#contextmenu').hide();
    });
    /**
     * toDownLoadPicture
     * */
    $(document).on('click','#uploadbutton',function(e){
        if(e.which === 1){
            /**
             * show tips
             * */
            $('#picturenumber').hide();
            $('#uploaddata').modal('show');

            reDraw4print();
        }
    });
    /**
     * to preview room
     * */
    $(document).on('click','#previewroombutton',function(e){
        $('#previewroom').modal('show');
        $('#previewroom-resizehandle').css('left', '50%');
        $('#previewroom-resize>.progress-bar').css('width','50%');
        MoreiiCustom.previewRoom();
    });
    /**
     * previewroom resize-wallpaper bar
     * */

    $(document).on('mousedown','#previewroom-resizehandle',function(e){
        e.preventDefault();
        MoreiiCustom.cache.mouseState.resizePreviewRoom = true;
    });
    $(document).on('mousemove','#previewroom-resizehandle',function(e){
        e.preventDefault();
        if(MoreiiCustom.cache.mouseState.resizePreviewRoom){
            MoreiiCustom.movePreviewRoomHandle($(this),e);
        }
    });
    /*$(document).on('mouseout','#previewroom-resizehandle',function(e){
        e.preventDefault();
        MoreiiCustom.cache.mouseState.resizePreviewRoom = false;
        MoreiiCustom.resizePreviewRoomCell($(this),e);
    });*/
    /**
     * save drawData
     * */
    $(document).on('click','#previewroom-save',function(e){
        var drawData = MoreiiCustom.buildCustomData();
        $.ajax({
            method:'POST',
            url:siteUrl+'custom/api/addCustom',
            data:{
                drawData:drawData
            },
            dataType:'json',
            success:function(data){
                if(data.err === null){
                    $('#previewroom').modal('hide');
                }
            },
            error:function(err){

            }
        })
    });
});