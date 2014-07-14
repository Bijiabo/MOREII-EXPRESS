/**
 * Created by bijiabo on 14-7-13.
 */
var classObj = {
    cache:{
        classData:{}    //课程内容缓存
    },
    formatTime:function(dateObj,addZero){
        if(addZero===undefined){
            var addZero = true;
        }
        var year = dateObj.getFullYear(),
            month= dateObj.getMonth()+ 1,
            date = dateObj.getDate();
        if(addZero){
            if(month<10){
                month = '0'+ month;
            }
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
                //do nothing.
            },
            success:function(data){
                if(!data.err){
                    var startTime = new Date(classObj.cache.classData.startTime.split(/[\u4e00-\u9fa5]/).join('/')),
                        endTime = new Date(classObj.cache.classData.endTime.split(/[\u4e00-\u9fa5]/).join('/'));
                    $('#class-list-tbody').append([
                        '<tr>',
                        '<td>'+classObj.cache.classData.name+'</td>',
                        '<td>0</td>',
                        '<td>'+classObj.formatTime(startTime,false)+'</td>',
                        '<td>'+classObj.formatTime(endTime,false)+'</td>',
                        '<td><button class="btn btn-default btn-xs class-modify" type="button" data-id="'+data.classId+'">编辑</button></td>',
                        '</tr>'
                    ].join('\n'));
                    $('#class-addclass').modal('hide');
                }else{
                    alert('添加课程出现错误，请重试。');
                }
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
        classObj.cache.classId = el.data('id');
        $.ajax({
            url:siteUrl+'class/api/getClassInfoById/'+classObj.cache.classId,
            method:'GET',
            dataType:'json',
            success:function(data){
//                console.log(data);
                var startTime = new Date(data.data.startTime),
                    endTime = new Date(data.data.endTime);
                if(!data.err){
                    $('#class-modify-name').val(data.data.name);
                    $('#class-modify-intro').val(data.data.intro);
                    $('#class-modify-starttime').val(classObj.formatTime(startTime));
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
        });
    },
    modifyClass:function(el,e){
        classObj.cache.classData={
            name:$('#class-modify-name').val(),
            intro:$('#class-modify-intro').val(),
            startTime:$('#class-modify-starttime').val(),
            endTime:$('#class-modify-endtime').val()
        };
        $.ajax({
            url:siteUrl+'class/api/modifyClass/'+classObj.cache.classId,
            method:'POST',
            dataType:'json',
            data:{
                classData:classObj.cache.classData
            },
            success:function(data){
                if(!data.err){
                    var startTime = new Date(classObj.cache.classData.startTime.split(/[\u4e00-\u9fa5]/).join('/')),
                        endTime = new Date(classObj.cache.classData.endTime.split(/[\u4e00-\u9fa5]/).join('/'));
                    var trBox = $('#class-listitem-'+classObj.cache.classId);
                    $(trBox.find('td').get(0)).text(classObj.cache.classData.name);
                    $(trBox.find('td').get(2)).text(classObj.formatTime(startTime,false));
                    $(trBox.find('td').get(3)).text(classObj.formatTime(endTime,false));
                    $('#class-modify').modal('hide');
                }else{
                    alert(data.des);
                }
            },
            error:function(err){
                alert('数据传输错误，请重试。');
            }
        });
    }
};
$(function(){
    //add date selecter
    $('.class-add-time,.class-modify-time').datepicker({
        weekStart: 1,
        todayBtn: "linked",
        language: "zh-CN",
        autoclose: true
    });
    //add listening
    $(document).on('click','#class-addclass-true',function(e){
        classObj.addClass($(this),e);
    });
    $(document).on('click','.class-modify',function(e){
        classObj.openModifyModal($(this),e);
    });
    $(document).on('click','#class-modify-true',function(e){
        classObj.modifyClass($(this),e);
    });
});