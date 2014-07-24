/**
 * Created by boooo on 14-7-24.
 */
var basicConsole = {
    cache:{},
    function:{
        initSidebar:function(){
            $(document).on('click','#console-sidebar-menubtn',function(e){
                e.preventDefault();
                e.stopPropagation();
                $('#console_sidebar').toggleClass('active');
            });
            $(document).on('click','#console_main',function(){
                $('#console_sidebar').removeClass('active');
            });
        }
    }
}
$(function(){
    basicConsole.function.initSidebar();
});