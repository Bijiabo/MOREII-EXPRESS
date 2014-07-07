/*video for moreii*/
var video = {
    cache:{
        image:[],
        imageLoadCount:0,
        imageLoaded:false,
        canvas:{}
    },
    loadImage2cache:function(){
        var allCount = 284;
        for(var i=0;i<allCount;i++){
            video.cache.image.push(new Image());
            var fileNameNumber = String(12+i);
            var fileName = ''
            for(var j=0;j<(8-fileNameNumber.length);j++){
                fileName = fileName+'0';
            }
            fileName = fileName + fileNameNumber + '.jpg';
            video.cache.image[i].src = siteUrl+'img/video/'+fileName;
            video.cache.image[i].onload = function(){
                video.cache.imageLoadCount++;
                if(video.cache.imageLoadCount>=allCount){
                    video.cache.imageLoaded = true;
                    $('#video-loading').fadeOut();
                    video.play();
                }
            }
        }
    },
    initCanvas:function(){
        var canvas = $('#videocanvas');
        canvas.attr('width',Math.round($(document).height()/108*192));
        canvas.attr('height',$(document).height());
        $('#videobox').css('margin-left','-'+Math.round($(document).height()/108*192/2)+'px');
        video.cache.canvas.videocanvas= document.getElementById('videocanvas');
        video.cache.canvas.context= video.cache.canvas.videocanvas.getContext('2d');
    },
    play:function(index){
        if(index === undefined){
            var index = 0;
        }
//        $('#videobox').css('background','url('+video.cache.image[index].src+')');
//        video.cache.canvas.context.stroke(index,index,10,10);
        video.cache.canvas.context.drawImage(video.cache.image[index],0,0,video.cache.canvas.videocanvas.width,video.cache.canvas.videocanvas.width/1920*1080);
        if(index+1<video.cache.image.length){
            setTimeout(function(){
                video.play(index+1);
            },100);
        }
    },
    draw2Canvas:function(){
        if(!video.cache.videoElement.ended){
            video.cache.canvas.context.drawImage(video.cache.videoElement,0,0,video.cache.canvas.videocanvas.width,video.cache.canvas.videocanvas.width/1920*1080);
            window.requestNextAnimationFrame(animate);
        }
    },
    playVideo:function(){
        video.cache.videoElement = $('#video').get(0);
        video.cache.videoElement.play();
//        window.requestNextAnimationFrame(animate);
        setTimeout(function(){
            video.drawLast2canvas();
        },28000);
    },
    drawLast2canvas:function(){
        var image = new Image();
        image.src = siteUrl+'img/video/00000295.jpg';
        image.onload = function(){
            video.cache.canvas.context.drawImage(image,0,0,video.cache.canvas.videocanvas.width,video.cache.canvas.videocanvas.height);
            $('#video').hide();
            $('#videobox').show();
        }
    }
}
$(function(){
    video.initCanvas();
//    video.loadImage2cache();
    video.playVideo();
})