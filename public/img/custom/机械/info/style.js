/**
 * Created by boooo on 14-6-19.
 */
MoreiiCustom.styleCustom = {
    initBackgroundColor:function(){
        var backgroundColorBox = $('#backgroundcolor');
        backgroundColorBox.html('');
        var colorArray = [
            '#FFFFFF',
            '#FBFEF1',
            '#FDF6F1',
            '#D7D7D8'
        ];
        var colorArrayLength = colorArray.length;
        for(var i=0;i<colorArrayLength;i++){
            backgroundColorBox.append('<div class="bgcoloritem" style="background-color:'+colorArray[i]+';"></div>');
        }
        MoreiiCustom.resizeBgcolorItem();
    }
};
$(function(){
    MoreiiCustom.styleCustom.initBackgroundColor();
});