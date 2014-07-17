/**
 * Created by boooo on 14-6-8.
 */
var blog = {
    appPath:'blog',
    update:function(id){
        var tags = $('.blog-tags');
        var tagArray = [];
        for(var i=0;i<tags.length;i++){
            tagArray.push($(tags[i]).text());
        };
        var blogData = {
            title:$(':input[name="title"]').val(),
            content:$(':input[name="content"]').val(),
            tag:tagArray
        };
        console.log(blogData);
        var success = function(data){
            if(!data.error){
                window.location.href = siteUrl+blog.appPath+'/detail/'+data.blogId;
//                console.log(siteUrl+blog.appPath+'/detail/'+data.blogId);
            }else{
                alert('提交错误，详情请查看控制台。');
            }
        };
        if(id===''){
            var url = siteUrl+blog.appPath+'/api/add';
        }else{
            var url = siteUrl+blog.appPath+'/api/update/'+id
        }
        $.ajax({
            url:url,
            method:'POST',
            dataType:'json',
            data:blogData,
            success:success
        });
    }
}
$(function(){
    $(document).on('click','#blog-save',function(){
        var blogId = $(':input[name="_id"]').val();
        blog.update(blogId);
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
})

