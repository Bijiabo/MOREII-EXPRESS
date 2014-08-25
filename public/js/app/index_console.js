/**
 * Created by boooo on 14-8-24.
 */
function ajaxFileUpload()
{
    //starting setting some animation when the ajax starts and completes
    $("#file")
        .ajaxStart(function(){
//            $(this).show();
            basic.stateModal('wait');
        })
        .ajaxComplete(function(){
            basic.stateModal('hide');
        });

    /*
     prepareing ajax file upload
     url: the url of script file handling the uploaded files
     fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
     dataType: it support json, xml
     secureuri:use secure protocol
     success: call back function when the ajax complete
     error: callback function when the ajax failed

     */
    $.ajaxFileUpload
    (
        {
            url:siteUrl+'api/upload/index/?savePath=indexpicture&ajax=true',
            secureuri:false,
            fileElementId:'file',
            dataType: 'json',
            success: function (data, status)
            {
                console.log(data);
                if(!data.error){
                    basic.stateModal('success');
                    console.log(siteUrl+data.path);
                    $('.index-content-item:eq('+cache.indexContentItemIndex+')>.index-content-imgbox').html('<img src="'+siteUrl+data.path+'" class="img-responsive">');
                    $('.index-content-item:eq('+cache.indexContentItemIndex+')').removeClass('empty');
                }else{
                    basic.stateModal('error',data.des);
                }
            },
            error: function (data, status, e)
            {
                console.log(data);
                basic.stateModal('error','上传失败，请检查网络。');
            }
        }
    )

    return false;

}
var index_consoleObject = {
    cache:{
        indexContentItemIndex:0
    },
    function:{
        addIndexContentItem:function(number){
            number=Number(number);
            if(isNaN(number)||number<1){number=1;}
            for(var i=0;i<number;i++){
                $('#index-content-box').append('<div class="col-md-12 index-content-item empty">\
                    <div class="index-content-imgbox"></div>\
                    <div class="index-content-item-btnbox"><span class="fa fa-chevron-up"></span><span class="fa fa-chevron-down"></span><span class="fa fa-times"></span></div>\
                    <div data-index="0" class="index-content-item-changepicture"><span class="fa fa-picture-o"></span></div>\
                </div>');
            }
        }
    }
}
$(function(){
    $(document).on('click','.index-content-item-changepicture',function(){
        cache.indexContentItemIndex=Number($(this).parents('.index-content-item').index());
        $('#file').click();
    });
    $(document).on('change','#file',function(){
        console.log($(this).val());
        ajaxFileUpload();
    });
    /*
    * 调整顺序
    * */
    $(document).on('click','.index-content-item-btnbox>.fa-chevron-up',function(){
        var indexOrigin = $(this).parents('.index-content-item').index();
        if(indexOrigin>0){
            $(this).parents('.index-content-item').insertBefore($('.index-content-item:eq('+(indexOrigin-1)+')'));
        }
    });
    $(document).on('click','.index-content-item-btnbox>.fa-chevron-down',function(){
        var indexOrigin = $(this).parents('.index-content-item').index();
        if(indexOrigin<$('.index-content-item').length-1){
            $(this).parents('.index-content-item').insertAfter($('.index-content-item:eq('+(indexOrigin+1)+')'));
        }
    });
    $(document).on('click','.index-content-item-btnbox>.fa-times',function(){
        $(this).parents('.index-content-item').remove();
        if($('.index-content-item').length<3){
            index_consoleObject.function.addIndexContentItem(3-$('.index-content-item').length);
        }
    });
});