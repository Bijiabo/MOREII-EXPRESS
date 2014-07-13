/**
 * Created by bijiabo on 14-7-12.
 */
var user = {
    cache:{},
    getObjectKeyNams:function(obj){
        var tmpArr = [];
        for(var item in obj)
        {
            tmpArr.push(item);
        }
        return tmpArr;
    },
    showModifyUserModal:function(el,e){
        var id = el.data('id'),
            name=el.data('name'),
            mail=el.data('mail');
        user.cache.userId = id;
        $('#user-modifyuserdata-name').val(name);
        $('#user-modifyuserdata-mail').val(mail);
        $('#modify-userdata').modal();
        $.ajax({
            url:siteUrl+'user/api/getUserPermission/'+id,
            method:'GET',
            dataType:'json',
            success:function(data){
                var permissionBox = $('#modify-userpermission'),
                    dataKeyNames = user.getObjectKeyNams(data),
                    html='',
                    optionCount=0,
                    optionHtml='';
                permissionBox.html('');
                for(var dataKey in data){
                    optionHtml='';
                    optionCount=0;
                    for(var option in data[dataKey]){
                        if(optionCount%3!==0 || optionCount===0){
                            if(data[dataKey][option]){
                                optionHtml+=[
                                    '<div class="col-xs-4">',
                                    '<select class="form-control" name="'+option+'" data-app="'+dataKey+'">',
                                        '<option value="true" selected>'+('&Omicron; '+option)+'</option>',
                                        '<option value="false">'+('&times; '+option)+'</option>',
                                    '</select>',
                                    '</div>'
                                ].join('\n');
                            }else{
                                optionHtml+=[
                                    '<div class="col-xs-4">',
                                    '<select class="form-control" name="'+option+'" data-app="'+dataKey+'">',
                                        '<option value="true">'+('&Omicron; '+option)+'</option>',
                                        '<option value="false"  selected>'+('&times; '+option)+'</option>',
                                    '</select>',
                                    '</div>'
                                ].join('\n');
                            }
                        }else{//换行神马的，麻烦=_=
                            if(data[dataKey][option]){
                                optionHtml+=[
                                    '</div></div><div class="form-group"><label class="col-xs-2 control-label" for="'+dataKey+'"> </label><div class="col-xs-10 row">',
                                    '<div class="col-xs-4">',
                                    '<select class="form-control" name="'+option+'" data-app="'+dataKey+'">',
                                        '<option value="true"  selected>'+('&Omicron; '+option)+'</option>',
                                        '<option value="false">'+('&times; '+option)+'</option>',
                                    '</select>',
                                    '</div>'
                                ].join('\n');
                            }else{
                                optionHtml+=[
                                    '</div></div><div class="form-group"><label class="col-xs-2 control-label" for="'+dataKey+'"> </label><div class="col-xs-10 row">',
                                    '<div class="col-xs-4">',
                                    '<select class="form-control" name="'+option+'" data-app="'+dataKey+'">',
                                        '<option value="true">'+('&Omicron; '+option)+'</option>',
                                        '<option value="false"  selected>'+('&times; '+option)+'</option>',
                                    '</select>',
                                    '</div>'
                                ].join('\n');
                            }
                        }
                        optionCount++;
                    }
                    html = [
                        '<div class="form-group">',
                            '<label class="col-xs-2 control-label" for="'+dataKey+'">'+dataKey+'</label>',
                            '<div class="col-xs-10 row">',
                                optionHtml,
                            '</div>',
                        '</div>'
                    ].join('\n');
                    permissionBox.append(html);
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    },
    editUserDataSubmit:function(el,e){
        user.cache.editUserData = {
            permission:{}
        };
        $.each(
            $('#modify-userdata input'),
            function(key,item){
                user.cache.editUserData[$(item).attr('name')]=$(item).val();
            }
        );
        $.each(
            $('#modify-userpermission select'),
            function(key,item){
                if(user.cache.editUserData.permission[String($(item).data('app'))]===undefined){
                    user.cache.editUserData.permission[String($(item).data('app'))]={};
                }
                if($(item).val()==='true'){
                    user.cache.editUserData.permission[String($(item).data('app'))][$(item).attr('name')]=true;
                }else{
                    user.cache.editUserData.permission[String($(item).data('app'))][$(item).attr('name')]=false;
                }
            }
        );
        $.ajax({
            url:siteUrl+'user/api/editUser/'+user.cache.userId,
            method:'POST',
            dataType:'json',
            data:{
                userData:user.cache.editUserData
            },
            beforeSend:function(XHR){
                el.data('origintext',el.text());
                el.html('&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;&nbsp;');
            },
            complete:function(XHR,TS){
                el.html(el.data('origintext'));
            },
            success:function(data){
                $('#modify-userdata').modal('hide');
                var tr = $('#userlist-'+user.cache.userId);
                tr.find('.userlist-name').text(user.cache.editUserData.name);
                tr.find('.userlist-mail').text(user.cache.editUserData.mail);
                tr.find('.user-console-modifyuser').data('name',user.cache.editUserData.name);
                tr.find('.user-console-modifyuser').data('mail',user.cache.editUserData.mail);
            },
            error:function(err){
                alert('提交错误，请重试。');
            }
        })
    }
}
$(function(){
    $(document).on('click','.user-console-modifyuser',function(e){
        user.showModifyUserModal($(this),e);
    });
    $(document).on('click','#user-console-edituserdata',function(e){
        user.editUserDataSubmit($(this),e);
    });
});