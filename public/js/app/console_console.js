/**
 * Created by boooo on 14-8-2.
 */
function ajaxFileUpload(){
    //starting setting some animation when the ajax starts and completes
    $(document)
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
        url:siteUrl+'api/upload/console/?savePath=logo&resize=120&ajax=true&_csrf='+$(':input[name="_csrf"]').val(),
        secureuri:false,
        fileElementId:'file',
        dataType: 'json',
        success: function (data, status)
        {
            if(!data.error){
                basic.stateModal('success');
                $('#console-logoimagebox').html('');
                $('#console-logoimagebox').append('<img class="img-responsive" src="'+siteUrl+data.path+'">');
                $('#console-logoimagebox').data('path',data.path);
                $('#console-logoimagebox').data('resizepath',data.resizePath);
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
var consoleObj = {
    app:'console',
    cache:{
        siteInfo:{},
        activeNavItem:{}
    },
    function:{
        getSiteInfoFromForm:function(){
            var siteInfoForm = $('#console-siteinfo-form'),
                appDataDom = $('.console-appdata');
            consoleObj.cache.siteInfo = {
                siteName:siteInfoForm.find(':input[name="sitename"]').val(),
                domain:siteInfoForm.find(':input[name="domain"]').val(),
                port:siteInfoForm.find(':input[name="port"]').val(),
                logo:siteInfoForm.find(':input[name="logo"]').val(),
                logoImage:$('#console-logoimagebox').data('path'),
                logoImageResize:$('#console-logoimagebox').data('resizepath'),
                app:{}
            };
            consoleObj.cache.siteInfo.siteUrl = 'http://'+consoleObj.cache.siteInfo.domain + ':'+consoleObj.cache.siteInfo.port+'/';
            $.each(appDataDom,function(key,item){
                consoleObj.cache.siteInfo.app[$(item).data('app')] = {
                    name:$(item).data('app'),
                    ico:$(item).data('ico'),
                    path:$(item).find('.console-appdata-path').val(),
                    cnName:$(item).find('.console-appdata-cnname').val(),
                    state:Number($(item).find('.console-appdata-state').val())
                };
            });
            return consoleObj.cache.siteInfo;
        },
        updateSiteInfo:function(){
            basic.stateModal('wait');
            $.ajax({
                type:'POST',
                url:siteUrl+consoleObj.app+'/api/modifySiteInfo',
                data:{
                    data:consoleObj.function.getSiteInfoFromForm()
                },
                dataType:'json',
                success:function(data){
                    if(!data.err){
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('danger',data.des);
                    }
                },
                error:function(err){
                    basic.stateModal('danger','提交错误，请检查网络。');
                }
            });
        },
        addNav:function(el){
            var form = el.parents('form'),
                text = form.find(':input[name="text"]').val(),
                app = form.find(':input[name="app"]').val(),
                href = form.find(':input[name="href"]').val(),
                html = ['<li data-href="'+href+'" data-app="'+app+'" data-text="'+text+'" class="applink applink-blog ui-sortable-handle">',
                    '<a href="#">',
                        '<span>'+text+'</span>',
                    '<span class="fa fa-pencil"></span>',
                    '<span class="fa fa-times"></span>',
                    '</a>',
                    '</li>'].join('\n');
            $('#console-setnav-collapse-ul').append(html);
            form.find(':input[name="text"]').val('');
            form.find(':input[name="app"]').val('');
            form.find(':input[name="href"]').val('');

        },
        modifyNav:function(el){
            var form = el,
                text = form.find(':input[name="text"]').val(),
                app = form.find(':input[name="app"]').val(),
                href = form.find(':input[name="href"]').val();
            consoleObj.cache.activeNavItem.data('text',text);
            consoleObj.cache.activeNavItem.data('app',app);
            consoleObj.cache.activeNavItem.data('href',href);
            consoleObj.cache.activeNavItem.find('a>span:first').text(text);
            $('#console-nav-modifynav').modal('hide');
            var modalBox = $('#console-nav-modifynav');
            modalBox.find(':input[name="text"]').val('');
            modalBox.find(':input[name="app"]').val('');
            modalBox.find(':input[name="href"]').val('');
        },
        getNavArray:function(){
            var navDom = $('#console-setnav-collapse-ul li'),
                navArray = [];
            $.each(navDom,function(key,item){
                navArray.push({
                    text:$(item).data('text'),
                    app:$(item).data('app'),
                    href:$(item).data('href')
                });
            });
            return navArray;
        },
        updateNav:function(){
            basic.stateModal('wait');
            $.ajax({
                url:siteUrl+consoleObj.app+'/api/updateNav',
                type:'post',
                dataType:'json',
                data:{
                    navArray:consoleObj.function.getNavArray()
                },
                success:function(data){
                    if(!data.err){
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('error',data.des);
                    }
                },
                error:function(err){
                    basic.stateModal('error','提交错误，请检查网络。');
                }
            });
        }
    }
};

$(function(){
    $(document).on('click','#console-save-siteinfo',function(){
        consoleObj.function.updateSiteInfo();
    });
    $(document).on('click','#console-addnav-btn',function(){
        consoleObj.function.addNav($(this));
    });
    $(document).on('click','#console-setnav-collapse-ul .fa-times',function(){
        $(this).parents('li').remove();
    });
    $(document).on('click','#console-savenav-btn',function(){
       consoleObj.function.updateNav();
    });
    $(document).on('click','#console-setnav-collapse-ul .fa-pencil',function(){
        consoleObj.cache.activeNavItem = $(this).parents('li');
        var modalBox = $('#console-nav-modifynav');
        modalBox.find(':input[name="text"]').val(consoleObj.cache.activeNavItem.data('text'));
        modalBox.find(':input[name="app"]').val(consoleObj.cache.activeNavItem.data('app'));
        modalBox.find(':input[name="href"]').val(consoleObj.cache.activeNavItem.data('href'));
        $('#console-nav-modifynav').modal('show');
    });
    $(document).on('click','#console-nav-modifynav-true',function(){
        consoleObj.function.modifyNav($('#console-nav-modifyform'));
    });
    //更新logo图片
    $(document).on('click','#console-changelogoimage',function(){
        $('#file').click();
    });
    $(document).on('change','#file',function(){
        ajaxFileUpload();
    });
});