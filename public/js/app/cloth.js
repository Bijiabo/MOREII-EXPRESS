/**
 * Created by boooo on 14-8-9.
 */
var clothConsole = {
    cache:{},
    function:{
        getAddInfo:function(){
            clothConsole.cache.addClothInfo = {};
            $.each($('#cloth-add-form :input'),function(index,item){
                clothConsole.cache.addClothInfo[$(item).attr('name')] = $(item).val();
            });
            console.log(clothConsole.cache.addClothInfo);
        }
    }
}
$(function(){
    $(document).on('click','#cloth-add-save',function(e){
        clothConsole.function.getAddInfo();
    });
});