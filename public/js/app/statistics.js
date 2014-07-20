/**
 * Created by bijiabo on 14-7-20.
 */
var statistics = {
    app:'statistics',
    debug:true,
    cache:{
        openTime:new Date(),
        loadingTime:0, //毫秒
        pageInfo:{},
        id:''
    },
    function:{
        getPath:function(x){//过滤出app下的路径
            var r0 = new RegExp('^\/'+app+'\/','ig'),
                r1 = new RegExp('^\/'+app,'ig');
            return x.replace(r0,'').replace(r1,'');
        },
        getPageInfo:function(){
            statistics.cache.pageInfo={
                app:app,
                url:window.location.href,
                path:statistics.function.getPath(window.location.pathname)
            };
            return statistics.cache.pageInfo;
        },
        submitData:function(){
            var data = statistics.function.getPageInfo();
            data.openTime = statistics.cache.openTime;
            data.loadingTime = Number(new Date()-loadTime_Start);
            $.ajax({
                url:siteUrl+statistics.app+'/api/submit',
                method:'POST',
                dataType:'json',
                data:{
                    data:data
                },
                success:function(data){
                    if(!data.err){
                        statistics.cache.id = data.id;
                    }else{
                        if(statistics.debug){
                            console.log(data.des);
                        }
                    }
                },
                error:function(err){
                    if(statistics.debug) {
                        console.log('提交统计数据失败.');
                    }
                }
            });
        },
        updateOpenTime:function(){
            $.ajax({
                url:siteUrl+statistics.app+'/api/updateOpenTime',
                method:'POST',
                dataType:'json',
                data:{
                    id:statistics.cache.id,
                    time:(new Date()-statistics.cache.openTime)/1000
                },
                success:function(data){
                    if(!data.err){
                        if(statistics.debug){
                            console.log('统计数据保存成功.');
                        }
                    }else{
                        if(statistics.debug){
                            console.log(data.des);
                        }
                    }
                },
                error:function(err){
                    if(statistics.debug) {
                        console.log('提交统计数据失败.');
                    }
                }
            })
        }
    }
}
$(function(){
    statistics.function.submitData();
});