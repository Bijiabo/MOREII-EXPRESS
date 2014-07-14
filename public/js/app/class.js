/**
 * Created by bijiabo on 14-7-13.
 */
var classObj = {
    cache:{
        classData:{}    //课程内容缓存
    },
    formatTime:function(dateObj){
        var year = dateObj.getFullYear(),
            month= dateObj.getMonth()+ 1,
            date = dateObj.getDate();
        if(month<10){
            month = '0'+ month;
        }
        return year+'年'+month+'月'+date+'日';
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
    },
    openModifyModal:function(el,e){
        $('#class-modify-form').hide();
        $('#class-modify-loading').show();
        $('#class-modify').modal('show');
        //get class info by id
        cache.classId = el.data('id');
        $.ajax({
            url:siteUrl+'class/api/getClassInfoById/'+cache.classId,
            method:'GET',
            dataType:'json',
            success:function(data){
                console.log(data);
                var startTIme = new Date(data.data.startTime),
                    endTime = new Date(data.data.endTime);
                if(!data.err){
                    $('#class-modify-name').val(data.data.name);
                    $('#class-modify-intro').val(data.data.intro);
                    $('#class-modify-starttime').val(classObj.formatTime(startTIme));
                    $('#class-modify-endtime').val(classObj.formatTime(endTime));
                    $('#class-modify-loading').hide();
                    $('#class-modify-form').show();
                }else{
                    alert(data.des);
                }
            },
            error:function(err){
                alert('数据获取错误，请重试。');
            }
        })
    }
};
$(function(){
    //add date selecter
    $('.class-add-time,.class-modify-time').datepicker({
        weekStart: 1,
        todayBtn: "linked",
        language: "zh-CN"
    });
    //add listening
    $(document).on('click','#class-addclass-true',function(e){
        classObj.addClass($(this),e);
    });
    $(document).on('click','.class-modify',function(e){
        classObj.openModifyModal($(this),e);
    });
});