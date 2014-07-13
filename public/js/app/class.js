/**
 * Created by bijiabo on 14-7-13.
 */
var classObj = {
    cache:{
        classData:{}    //课程内容缓存
    },
    addClass:function(el,e){
        classObj.cache.classData={
            name:$('#class-add-name').val(),
            intro:$('#class-add-intro').val(),
            startTime:$('#class-add-starttime').val(),
            endTime:$('#class-add-endtime').val()
        };
        $.ajax({
            url:siteUrl+'class/api/addClass',
            method:'POST',
            data:{
                classData:classObj.cache.classData
            },
            dataType:'json',
            beforeSend:function(XHR){
                console.log(classObj.cache.classData);
            },
            success:function(data){
                console.log(data);
            },
            error:function(err){
                alert('添加课程出现错误，请重试。');
            }
        });
    }
};
$(function(){
    //add date selecter
    $('.class-add-time').datepicker({
        weekStart: 1,
        todayBtn: "linked",
        language: "zh-CN"
    });
    //add listening
    $(document).on('click','#class-addclass-true',function(e){
        classObj.addClass($(this),e);
    });
});