/**
 * Created by bijiabo on 14-7-20.
 */
var statistics_console = {
    app:'statistics',
    debug:true,
    cache:{},
    function:{
        getPerLoadingTime:function(){
            $.ajax({
                url:siteUrl+statistics_console.app+'/api/perLoadingTime',
                method:'GET',
                dataType:'json',
                success:function(data){
                    if(!data.err){
                        for(var i=0;i<data.data.length;i++){
                            $('#loadingtime-'+data.data[i]._id.toLowerCase()).text(Math.floor(data.data[i].perLoadingTime));
                        }
                    }else if(statistics_console.debug){
                        console.log(data);
                    }
                },
                error:function(err){
                    if(statistics_console.debug){
                        console.log(err);
                    }
                }
            });
        }
    }
}
$(function(){
    statistics_console.function.getPerLoadingTime();
    {

    }
});