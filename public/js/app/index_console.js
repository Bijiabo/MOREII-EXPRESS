/**
 * Created by boooo on 14-8-24.
 */
function ajaxFileUpload(){
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
    $.ajaxFileUpload({
            url:siteUrl+'api/upload/index/?savePath=indexpicture&resize=720&ajax=true',
            secureuri:false,
            fileElementId:'file',
            dataType: 'json',
            success: function (data, status)
            {
                if(!data.error){
                    basic.stateModal('success');
                    $('.index-content-item:eq('+cache.indexContentItemIndex+')>.index-content-imgbox').html('<img src="'+siteUrl+data.path+'" class="img-responsive" data-resize="'+data.resizePath+'" data-path="'+data.path+'">');
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
        });
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
        },
        getIndexContent:function(){
            index_consoleObject.cache.indexData = {
                type:'system',
                style:'default',
                image:[]
            };
            $.each($('.index-content-item'),function(index,item){
                if($(item).find('.index-content-imgbox img').length>0){
                    index_consoleObject.cache.indexData.image.push({
                        path:$(item).find('.index-content-imgbox img').data('path'),
                        resizePath:$(item).find('.index-content-imgbox img').data('resize')
                    });
                }
            });
            return index_consoleObject.cache.indexData;
        },
        saveIndexImage:function(id){
            if(id===undefined){id='';}
            $.ajax({
                url:siteUrl+'console/api/updateIndex/'+id,
                type:'POST',
                dataType:'json',
                data:{
                    indexData:index_consoleObject.function.getIndexContent()
                },
                success:function(data){
                    if(!data.err){
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('error',data.des);
                    }
                },
                error:function(err){
                    basic.stateModal('error','连接失败，请检查连接。');
                }
            });
        },
        getTextContent:function(){
            index_consoleObject.cache.textData = [];
            var error = {
                error:false,
                des:''
            };
            $.each($('.index-text-panel'),function(index,item){
                if(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test($(item).find('.index-text-linkurl').val())){
                    if(!/^\s*$/.test($(item).find('.index-text-title').val()) && !/^\s*$/.test($(item).find('.index-text-des').val()) && !/^\s*$/.test($(item).find('.index-text-linkurl').val()) && !/^\s*$/.test($(item).find('.index-text-linktext').val())){
                        index_consoleObject.cache.textData.push({
                            title:$(item).find('.index-text-title').val(),
                            des:$(item).find('.index-text-des').val(),
                            linktext:$(item).find('.index-text-linktext').val(),
                            linkurl:$(item).find('.index-text-linkurl').val()
                        });
                    }else{
                        error.error=true;
                        error.des='内容不能为空'
                    }

                }else{
                    error.error=true;
                    error.des='网址格式错误'
                }
            });
            return error;
        },
        saveIndexText:function(id){
            if(!id){
                id=''
            }
            $.ajax({
                url:siteUrl+'console/api/updateIndex/'+id,
                type:'POST',
                dataType:'json',
                data:{
                    indexData:{
                        text:index_consoleObject.cache.textData
                    }
                },
                success:function(data){
                    if(!data.err){
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('error',data.des);
                    }
                },
                error:function(err){
                    basic.stateModal('error','连接失败，请检查连接。');
                }
            });
        },
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
    //添加
    $(document).on('click','#index-content-addone',function(){
        index_consoleObject.function.addIndexContentItem(1);
    });
    //保存图片内容
    $(document).on('click','#index-content-save',function(){
        index_consoleObject.function.saveIndexImage($(this).data('id'));
    });
    //保存文字内容
    $(document).on('click','#index-text-save',function(){
        var getText = index_consoleObject.function.getTextContent();
        if(!getText.error){
            index_consoleObject.function.saveIndexText($(this).data('id'));
        }else{
            basic.stateModal('error',getText.des);
        }
    });
});