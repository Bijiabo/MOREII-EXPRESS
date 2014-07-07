/**
 * Created by boooo on 14-6-8.
 */
var blog = {
    submitComment:function(el){
        var commentData = {
            content:$('#comment-content').val(),
            app:el.parents('form').data('app'),
            appPageId:el.parents('form').data('apppageid')
        }
        var success = function(data){
            if(data.err===null){
                $(':input[name="content"]').val('');
                basic.getComment();
            }
        }
        console.log(commentData);
        $.ajax({
            method:'POST',
            url:siteUrl+'comment/api/add',
            data:commentData,
            dataType:'json',
            success:success,
            error:function(err){console.log(err);}
        })
    },
    getShareUrl:function(el,callback){
        $.ajax({
            method:'GET',
            url:siteUrl+'blog/getShareUrl/'+el.data('id'),
            dataType:'json',
            success:function(data){
                if(data.err===null){
                    callback(siteUrl+'blog/article/'+data.url);
                }else{
                    alert('获取分享链接失败，请稍后重试:)');
                }
            }
        })
    }
}

$(function(){
    $(document).on('click','#comment-submit',function(){
        blog.submitComment($(this));
    });
    $(document).on('keydown','#comment-content',function(e){
        if(e.keyCode===13){
            blog.submitComment($(this));
        }
    });
    $(document).on('click','#getshareurl',function(){
        blog.getShareUrl($(this),function(url){
            console.log(url);
        });

    });
});