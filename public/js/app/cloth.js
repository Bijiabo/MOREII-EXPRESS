/**
 * Created by boooo on 14-8-9.
 */
var clothConsole = {
    cache:{},
    function:{
        getAddInfo:function(){
            clothConsole.cache.addClothInfo = {
                picture:cache.uploadImageFiles,
                description:$('#cloth-add-description>.summernote').code()
            };
            $.each($('#cloth-add-form :input'),function(index,item){
                clothConsole.cache.addClothInfo[$(item).attr('name')] = $(item).val();
            });
//            console.log(clothConsole.cache.addClothInfo);
            $.ajax({
                type:'POST',
                url:siteUrl+app+'/api/add/?ajax=true',
                data:{
                    addClothInfo:clothConsole.cache.addClothInfo
                },
                dataType:'json',
                success:function(r){
                    console.log(r);
                    if(!r.err){
                        basic.stateModal('success','添加成功，跳转中...');
                        cache.setTimeoutIdForAdd = setTimeout(function(){window.location.href=siteUrl+app+'/console/list'},1000);
                    }else{
                        basic.stateModal('danger',r.des);
                    }
                }
            });
        }
    }
}
$(function(){
    $(document).on('click','#cloth-add-save',function(e){
        clothConsole.function.getAddInfo();
    });
});