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
    $(document).on('click','#header-messagebox',function(e){
        $('#messagebox').modal('show');
    });
    //表格选择
    $(document).on('click','.thead-checkbox',function(e){
        var el = $(this);
        $.each($(el.parents('table')).find('tbody tr td input[type="checkbox"]'),function(index,item){
            $(item).click();
        });
    });
 });