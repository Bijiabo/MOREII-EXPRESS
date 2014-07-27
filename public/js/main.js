/**
 * Created by boooo on 14-5-20.
 */
$(function(){
    basic.ready();
    basic.setAppLink();
    $(document).on('change','input[type="password"]',function(){
        $(this).val(basic.pwdencode($(this).val()));
    });
    basic.getComment();
    basic.checkLogin();
    $(document).on('click','#header-messagebox',function(e){
        $('#messagebox').modal('show');
    });
    //表格选择
    $(':checkbox.thead-checkbox').on('toggle', function(e) {
        basic.tableAllCheck($(this),e);
    });
    $(window).on('resize',function(){
        basic.resize();
    });
 });