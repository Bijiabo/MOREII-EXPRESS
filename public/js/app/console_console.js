/**
 * Created by boooo on 14-8-2.
 */
var consoleObj = {
    app:'console',
    cache:{
        siteInfo:{}
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
                app:[]
            };
            consoleObj.cache.siteInfo.siteUrl = 'http://'+consoleObj.cache.siteInfo.domain + ':'+consoleObj.cache.siteInfo.port+'/';
            $.each(appDataDom,function(key,item){
                consoleObj.cache.siteInfo.app.push({
                    name:$(item).data('app'),
                    ico:$(item).data('ico'),
                    path:$(item).find('.console-appdata-path').val(),
                    cnName:$(item).find('.console-appdata-cnname').val(),
                    state:Number($(item).find('.console-appdata-state').val())
                });
            });
            return consoleObj.cache.siteInfo;
        },
        updateSiteInfo:function(){
            $.ajax({
                type:'POST',
                url:siteUrl+consoleObj.app+'/api/modifySiteInfo',
                data:{
                    data:consoleObj.function.getSiteInfoFromForm()
                },
                dataType:'json',
                beforeSend:function(XHR){
                    basic.stateModal('wait');
                },
                success:function(data){
                    if(!data.err){
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('danger');
                    }
                },
                error:function(err){
                    alert('提交错误，请检查网络。');
                    basic.stateModal('danger');
                }
            });
        }
    }
};

$(function(){
    $(document).on('click','#console-save-siteinfo',function(){
        consoleObj.function.updateSiteInfo();
    });
});