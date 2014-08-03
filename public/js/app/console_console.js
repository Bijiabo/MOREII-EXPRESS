/**
 * Created by boooo on 14-8-2.
 */
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
            $.ajax({
                url:siteUrl+consoleObj.app+'/api/updateNav',
                type:'post',
                dataType:'json',
                data:{
                    navArray:consoleObj.function.getNavArray()
                },
                beforeSend:function(XHR){
                    basic.stateModal('wait');
                },
                success:function(data){
                    if(!data.err){
                        basic.stateModal('success');
                    }else{
                        basic.stateModal('error');
                    }
                },
                error:function(err){
                    basic.stateModal('error');
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
});