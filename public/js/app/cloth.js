/**
 * Created by boooo on 14-8-9.
 */
var cloth = {
    cache:{},
    function:{
        getDetail:function(el){
            $.ajax({
                type:'POST',
                url:siteUrl+app+'/detail/'+el.data('id'),
                dataType:'json',
                cache:true,
                success:function(data){
                    if(!data.err){
                        //console.log(data.data);
                        $('#cloth-sidebar .panel-body').html([
                            '<p>编号：'+data.data.codeNumber+'</p>',
                            '<p>品牌：'+data.data.brand+'</p>',
                            '<p>产地：'+data.data.originPlace+'</p>',
                            '<p>纱支：'+data.data.yarnCount+'</p>',
                            '<p>克重：'+data.data.weight+'</p>',
                        ].join('\n'));
                    }
                }
            })
        }
    }
}
jQuery(function($) {
    $(document).ready( function() {
        $(document).on('mouseover','.cloth-list-item',function(e){
            cloth.function.getDetail($(this));
        });
        //init sidebar panel width
        if($('#cloth-sidebar>.panel:first').length>0){
            $('#cloth-sidebar>.panel:first').css('width',$('#cloth-sidebar>.panel:first').width()+'px');
            $('#cloth-sidebar>.panel:first').stickUp({
                topMargin: "auto"
            });
        }
    });
});