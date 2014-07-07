/**
 * Created by boooo on 14-5-20.
 */
$(function(){
    basic.ready();
    basic.setAppLink();
    $(document).on('change','input[type="password"]',function(){
        $(this).val(basic.pwdencode($(this).val()));
    });
    basic.uploadGoodImage();
    basic.getComment();
    basic.checkLogin();
 });