/**
 * Created by bijiabo on 14-7-12.
 */
var user = {
    cache:{},
    showModifyUserModal:function(el,e){
        var id = el.data('id'),
            name=el.data('name'),
            mail=el.data('mail');
        $('#user-modifyuserdata-name').val(name);
        $('#user-modifyuserdata-mail').val(mail);
        $('#modify-userdata').modal();
    }
}
$(function(){
    $(document).on('click','.user-console-modifyuser',function(e){
        user.showModifyUserModal($(this),e);
    });
});