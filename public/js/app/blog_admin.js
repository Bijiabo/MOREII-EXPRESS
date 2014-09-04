/**
 * Created by boooo on 14-6-8.
 */
var blog = {
    appPath:'blog',
    update:function(id,type){
        var tags = $('#blog-'+type+'blog-tags').val(),
            tagArray = tags.split(' ').unique();

        var blogData = {
            title:$('#blog-'+type+'blog-title').val(),
            content:$('#blog-'+type+'blog-content>div').code(),
            tag:tagArray,
            format:'html',
            type:'blog'
        };
        var success = function(data){
            if(!data.error){
                basic.stateModal('success');
                window.setTimeout(function(){
                    window.location.href = siteUrl+blog.appPath+'/detail/'+data.blogId;
                },1000);
            }else{
                basic.stateModal('error',data.des);
            }
        };
        if(type==='add'){
            var url = siteUrl+blog.appPath+'/api/add';
        }else{
            var url = siteUrl+blog.appPath+'/api/update/'+id
        }
        $.ajax({
            url:url,
            type:'POST',
            dataType:'json',
            data:blogData,
            success:success
        });
    },
    updatePage:function(id,type){
        var tags = $('#blog-'+type+'blog-tags').val(),
            tagArray = tags.split(' ').unique();

        var blogData = {
            title:$('#blog-'+type+'blog-title').val(),
            content:$('#blog-'+type+'blog-content>div').code(),
            tag:tagArray,
            format:'html',
            type:'page'
        };
        var success = function(data){
            if(!data.error){
                basic.stateModal('success');
                window.setTimeout(function(){
                    window.location.href = siteUrl+blog.appPath+'/detail/'+data.blogId;
                },1000);
            }else{
                basic.stateModal('error',data.des);
            }
        };
        if(type==='add'){
            var url = siteUrl+blog.appPath+'/api/add';
        }else{
            var url = siteUrl+blog.appPath+'/api/update/'+id
        }
        $.ajax({
            url:url,
            type:'POST',
            dataType:'json',
            data:blogData,
            success:success
        });
    },
    deleteBlogs:function(el,e){
        var idArray = [];
        $.each($('#blog-bloglisttable :checkbox:checked'),function(index,item){
            idArray.push($(item).val());
        });
        //debug
//        console.log(idArray);
        $.ajax({
            url:siteUrl+blog.appPath+'/api/deleteBlogs',
            type:'POST',
            dataType:'json',
            data:{
                idArray:idArray
            },
            beforSend:function(XHR){
                basic.stateModal('wait');
            },
            success:function(data){
                if(!data.err){
                    basic.stateModal('success');
                    $.each($('#blog-bloglisttable :checkbox:checked'),function(index,item){
                        $(item).parents('tr').remove();
                    });
                }else{
                    basic.stateModal('danger',data.des);
                }
            },
            error:function(XHR){
                basic.stateModal('danger','网络连接错误。');
//                alert('网络连接错误。');
            }
        });
    },
    previewBlog:function(el,e){
        var blogId = el.data('blogid');
        $.ajax({
            url:siteUrl+blog.appPath+'/api/getBlogDetail/'+blogId+'?forEdit=false',
            type:'GET',
            beforeSend:function(XHR){
                basic.stateModal('wait');
                el.find('span').removeClass('fa-eye').addClass('fa-spinner fa-spin');
            },
            success:function(data){
                basic.stateModal('hide');
                el.find('span').addClass('fa-eye').removeClass('fa-spinner fa-spin');
                if(!data.err){
                    $('#blog-previewblog h3').text(data.data.info.title);
                    var content = '';
                    for(var i=0;i<data.data.content.length;i++){
                        content+=data.data.content[i].content;
                    }
                    if(data.data.info.format==='html'){
                        $('#blog-previewblog-content').html(content);
                    }else{
                        $('#blog-previewblog-content').html(markdown.toHTML(content));
                    }
                    $('#blog-previewblog').addClass('active');
                }else{
                    alert(data.des);
                }
            },
            error:function(){
                el.find('span').addClass('fa-eye').removeClass('fa-spinner fa-spin');
                alert('连接错误，请重试。');
            }
        });
    },
    getTags:function(){
        var tagArray = [];
        $.each($('.blog-tags'),function(index,item){
            if(!/^\s*$/.test($(item).text())){
                tagArray.push($(item).text());
            }
        });
        return tagArray;
    }
}
$(function(){
    $(document).on('click','.console-blog-submit',function(){
        var el = $(this),
            blogId = el.data('id'),
            type = el.data('type');
        blog.update(blogId,type);
    });
    $(document).on('keydown','#tag',function(e){
        if(e.keyCode===13){
            var tag = $(this).val();
            $(this).val('');
            if(!/^\s*$/.test(tag)){
                var tags = $('#tagbox>a');
                var hasTag = false;
                for(var i=0;i<tags.length;i++){
                    if(tag===$(tags.get(i)).text()){
                        hasTag = true;
                    }
                }
                if(!hasTag){
                    $('#tagbox').append('<a class="btn btn-default blog-tags">'+tag+'</a>');
                }
            }
        }
    });
    //删除日志
    $(document).on('click','#blog-deleteblogs',function(e){
        blog.deleteBlogs($(this),e);
    });
    //预览日志
    $(document).on('click','.blog-console-preview',function(e){
        blog.previewBlog($(this),e);
    });
    //新建日志
    $(document).on('click','#blog-write-new',function(e){
        basic.consoleModal('#blog-addblog','show',function(el){});
    });
    //修改日志
    $(document).on('click','.blog-console-edit',function(e){
        var element = $(this);
        basic.consoleModal('#blog-editblog','show',function(el){
            $('#blog-editblog-title,#blog-editblog-content').val('数据加载中...');
            var blogId = element.data('blogid');
            $.ajax({
                url:siteUrl+blog.appPath+'/api/getBlogDetail/'+blogId+'?forEdit=true',
                type:'GET',
                beforeSend:function(XHR){
                    basic.stateModal('wait');
                },
                success:function(data){
                    basic.stateModal('hide');
                    if(!data.err){
                        $('#blog-editblog-title').val(data.data.info.title);
                        var content = '';
                        for(var i= 0,len=data.data.content.length;i<len;i++){
                            content+=data.data.content[i].content;
                            if(i!==len-1){
                                content+='<div>======</div>';
                            }
                        }
                        $('#blog-editblog-content>div.summernote').html(content);
                        $('#blog-editblog-tags').val(data.data.info.tag.join(' '));
                        $('#blog-editblog-submit').data('id',data.data.info._id.toString());
                        $('#blog-editpage-submit').data('id',data.data.info._id.toString());
                    }else{
                        alert(data.des);
                    }
                },
                error:function(){
                    alert('连接错误，请重试。');
                }
            });
        });
    });
    //添加页面
    $(document).on('click','.console-page-submit',function(){
        var el = $(this),
            blogId = el.data('id'),
            type = el.data('type');
        blog.updatePage(blogId,type);
    });
    //前台保存修改
    $(document).on('click','#blog-save',function(event){
        if(blog.getTags()!==[]){
            var tag = blog.getTags();
        }else{
            tag = [];
        }
        var id = $(':input[name="_id"]').val();
        var blogData = {
            title:$('#blog-editblog-title').val(),
            content:$('#blog-edit-content').code(),
            tag:tag,
            format:'html',
            type:$(':input[name="type"]').val()
        };
        var success = function(data){
            if(!data.error){
                basic.stateModal('success');
                window.setTimeout(function(){
                    window.location.href = siteUrl+blog.appPath+'/detail/'+data.blogId;
                },1000);
            }else{
                basic.stateModal('error',data.des);
            }
        };
        var url = siteUrl+blog.appPath+'/api/update/'+id;
        $.ajax({
            url:url,
            type:'POST',
            dataType:'json',
            data:blogData,
            success:success
        });
    });
})

