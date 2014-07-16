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
                        '<td>',
                        '<span class="class-listitem-studentcount">0</span>',
                        '<span class="class-modify-student fa fa-pencil">&nbsp;编辑</span>',
                        '</td>',
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
    },
    openModifyStudent:function(el,e){
        //#class-modifystudent
        $('#class-modifystudent').modal('show');
    },
    addUserToStudent:function(el,e){
        var userIdArray = [];
        $.each($('#class-listtable-user .class-listtabel-checkbox-item:checked'),function(key,item){
            userIdArray.push($(item).val());
        });
        $.ajax({
            url:siteUrl+'class/api/addUserToStudent',
            method:'POST',
            dataType:'json',
            data:{
                userIdArray:userIdArray
            },
            success:function(data){
                if(!data.err){
                    $.each($('#class-listtable-user .class-listtabel-checkbox-item:checked'),function(key,item){
                        $($(item).parents('tr').find('td:last')).html('<span class="text-success fa fa-mortar-board">&nbsp;&nbsp;在校</span>');
                    });
                    $('#class-removeusertostudent').modal('hide');
                }else{
                    alert('添加学生失败，请重试。');
                }
            },
            error:function(err){
                alert('提交数据错误，请重试。');
            }
        });
    },
    removeUserToStudent:function(el,e){
        var userIdArray = [];
        $.each($('#class-listtable-user .class-listtabel-checkbox-item:checked'),function(key,item){
            userIdArray.push($(item).val());
        });
        $.ajax({
            url:siteUrl+'class/api/removeUserToStudent',
            method:'POST',
            dataType:'json',
            data:{
                userIdArray:userIdArray
            },
            success:function(data){
                if(!data.err){
                    $.each($('#class-listtable-user .class-listtabel-checkbox-item:checked'),function(key,item){
                        $($(item).parents('tr').find('td:last')).html('<span class="fa fa-times">&nbsp;&nbsp;校外</span>');
                    });
                    $('#class-removeusertostudent').modal('hide');
                }else{
                    alert('删除学生失败，请重试。');
                }
            },
            error:function(err){
                alert('提交数据错误，请重试。');
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
    $(document).on('click','.class-modify-student',function(e){//编辑学生名单
        classObj.openModifyStudent($(this),e);
    });
    //添加学生身份
    $(document).on('click','#class-add-user2student',function(e){
        classObj.addUserToStudent($(this),e);
    });
    //删除学生身份
    $(document).on('click','#class-remove-user2student',function(e){
        $('#class-removeusertostudent').modal('show');
    });
    $(document).on('click','#class-removeusertostudent-true',function(e){
        classObj.removeUserToStudent($(this),e);
    });
});