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
            tag:tagArray
        };
        var success = function(data){
            if(!data.error){
                window.location.href = siteUrl+blog.appPath+'/detail/'+data.blogId;
            }else{
                alert('提交错误，详情请查看控制台。');
                console.log(data.des);
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
            success:function(data){
                if(!data.err){
                    $.each($('#blog-bloglisttable:checkbox:checked'),function(index,item){
                        $(item).parents('tr').remove();
                    });
                }else{
                    alert(data.des);
                }
            },
            error:function(XHR){
                alert('网络连接错误。');
            }
        });
    },
    previewBlog:function(el,e){
        var blogId = el.data('blogid');
        $.ajax({
            url:siteUrl+blog.appPath+'/api/getBlogDetail/'+blogId,
            type:'GET',
            beforeSend:function(XHR){
                el.find('span').removeClass('fa-eye').addClass('fa-spinner fa-spin');
            },
            success:function(data){
                el.find('span').addClass('fa-eye').removeClass('fa-spinner fa-spin');
                if(!data.err){
                    $('#blog-previewblog h6').text(data.data.info.title);
                    var content = '';
                    for(var i=0;i<data.data.content.length;i++){
                        content+=data.data.content[i].content;
                    }
                    $('#blog-previewblog-content').html(markdown.toHTML(content));
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
                    $('#tagbox').append('<a class="btn btn-info blog-tags">'+tag+'</a>');
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
                url:siteUrl+blog.appPath+'/api/getBlogDetail/'+blogId,
                type:'GET',
                beforeSend:function(XHR){
                },
                success:function(data){
                    if(!data.err){
                        $('#blog-editblog-title').val(data.data.info.title);
                        var content = '';
                        for(var i=0;i<data.data.content.length;i++){
                            content+=data.data.content[i].content;
                        }
                        $('#blog-editblog-content').val(content);
                        $('#blog-editblog-tags').val(data.data.info.tag.join(','));
                        var tagHtml = '';
                        for(var i=0;i<data.data.info.tag.length;i++){
                            tagHtml += '<span class="tag"><span>'+data.data.info.tag[i]+'</span><a class="tagsinput-remove-link"></a></span>';
                        };
                        $('#blog-editblog-tags_tagsinput .tag').remove();
                        $('#blog-editblog-tags_tagsinput').prepend(tagHtml);
                        $('#blog-editblog-submit').data('id',data.data.info._id.toString());
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
})

