/**
 * Created by boooo on 14-8-9.
 */
var clothConsole = {
    cache:{
        getPreview:true
    },
    function:{
        getInfo:function(){
            clothConsole.cache.addClothInfo = {
                picture:cache.uploadImageFiles,
                description:$('#cloth-add-description>.summernote').code()
            };
            $.each($('#cloth-add-form :input'),function(index,item){
                clothConsole.cache.addClothInfo[$(item).attr('name')] = $(item).val();
            });
        },
        add:function(){
            clothConsole.function.getInfo();
            $.ajax({
                type:'POST',
                url:siteUrl+app+'/api/add/?ajax=true',
                data:{
                    addClothInfo:clothConsole.cache.addClothInfo
                },
                dataType:'json',
                beforeSend:function(XHR){
                    basic.stateModal('wait');
                },
                success:function(r){
                    console.log(r);
                    if(!r.err){
                        basic.stateModal('success','添加成功，跳转中...');
                        cache.setTimeoutIdForAdd = setTimeout(function(){window.location.href=siteUrl+app+'/console/list'},1000);
                    }else{
                        basic.stateModal('error',r.des);
                    }
                },
                error:function(err){
                    basic.stateModal('error','请检查连接');
                }
            });
        },
        update:function(){
            clothConsole.function.getInfo();
            $.ajax({
                type:'POST',
                url:siteUrl+app+'/console/edit/'+cache.clothEditId+'/?ajax=true',
                data:{
                    addClothInfo:clothConsole.cache.addClothInfo
                },
                dataType:'json',
                beforeSend:function(XHR){
                    basic.stateModal('wait');
                },
                success:function(r){
                    if(!r.err){
                        basic.stateModal('success','修改成功，跳转中...');
                        cache.setTimeoutIdForAdd = setTimeout(function(){window.location.href=siteUrl+app+'/console/list'},1000);
                    }else{
                        basic.stateModal('error',r.des);
                    }
                },
                error:function(err){
                    basic.stateModal('error','请检查连接');
                }
            });
        },
        delete:function(){
            var idArray = [];
            $.each($('#cloth-consolelisttable :checkbox'),function(index,item){
                if($(item).prop('checked')){
                    idArray.push($(item).data('id'));
                }
            });
            $.ajax({
                url:siteUrl+app+'/api/delete',
                type:'POST',
                dataType:'json',
                data:{
                    idArray:idArray
                },
                beforeSend:function(XHR){
                    basic.stateModal('wait');
                },
                success:function(data){
                    if(!data.err){
                        $.each($('#cloth-consolelisttable :checkbox'),function(index,item){
                            if($(item).prop('checked')){
                                $(item).parents('tr').remove();
                            }
                        });
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('error',data.des);
                    }
                },
                error:function(err){
                    basic.stateModal('error','请检查连接');
                }
            });
        },
        getDetail:function(el,callback){
            $.ajax({
                type:'POST',
                url:siteUrl+app+'/detail/'+el.data('id'),
                dataType:'json',
                cache:true,
                success:function(data){
                    if(!data.err){
                        callback(el,data.data);
                    }
                }
            })
        }
    }
}
$(function(){
    $(document).on('click','#cloth-add-save',function(e){
        clothConsole.function.add();
    });
    $(document).on('click','.mii-dz-remove',function(){
        var path = $(this).data('path');
        for(var i= 0,len=cache.uploadImageFiles.length;i<len;i++){
            if(path===cache.uploadImageFiles[i].path){
                cache.uploadImageFiles.splice(i,1);
                break;
            }
        }
        $(this).parents('.dz-preview').remove();
    });
    $(document).on('click','#cloth-update-save',function(e){
        clothConsole.function.update();
    });
    $(document).on('click','#cloth-delete-btn',function(e){
        clothConsole.function.delete();
    });
    //浮动预览
    $(document).on('mouseover','#cloth-consolelisttable>tr',function(){
        clothConsole.function.getDetail($(this),function(el,data){
            $('#cloth-console-listpreview').remove();
            var htmlArray = ['<div id="cloth-console-listpreview" style="position: fixed;z-index:999;top:'+(el.offset().top+el.height()-$(document).scrollTop())+'px;left: '+el.offset().left+'px;display:none;border:1px solid #dddddd;padding:10px;background:#ffffff;">'];
            for(var i= 0,len=data.picture.length;i<len;i++){
                htmlArray.push('<img src="'+siteUrl+data.picture[i].resizePath+'" style="height:200px;width:auto;">');
            }
            htmlArray.push('</div>');
            $('body').append(htmlArray.join('\n'));
            $('#cloth-console-listpreview').fadeIn();
        });
    });
    $(document).on('mouseout','#cloth-consolelisttable>tr',function(){
        $('#cloth-console-listpreview').fadeOut();
        clothConsole.cache.getPreview = false;
    });
    $(document).on('mouseout','#cloth-consolelisttable',function(){
        $('#cloth-console-listpreview').remove();
    });
});