/**
 * Created by boooo on 14-6-8.
 */
var blog = {
    app:'blog',
    submitComment:function(el){
        var commentData = {
            content:$('#comment-content').val(),
            app:el.parents('form').data('app'),
            appPageId:el.parents('form').data('apppageid')
        };
        var success = function(data){
            if(data.err===null){
                $(':input[name="content"]').val('');
                basic.getComment();
            }
        };
        $.ajax({
            type:'POST',
            url:siteUrl+'comment/api/add',
            data:commentData,
            dataType:'json',
            success:success,
            error:function(err){console.log(err);}
        })
    },
    getShareUrl:function(el,callback){
        $.ajax({
            type:'GET',
            url:siteUrl+blog.app+'/getShareUrl/'+el.data('id'),
            dataType:'json',
            success:function(data){
                if(data.err===null){
                    callback(siteUrl+'blog/article/'+data.url);
                }else{
                    alert('获取分享链接失败，请稍后重试:)');
                }
            }
        });
    },
    randomBlog:function(el,callback){
        $.ajax({
            type:'GET',
            url:siteUrl+blog.app+'/api/randomBlog',
            dataType:'json',
            success:function(data){
                if(!data.err){
                    callback(data.data);
                }else{
                    console.log('randomBlog载入失败');
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
    blog.randomBlog($('#randomblog'),function(data){
        var html = '';
        for(var i=0;i<data.length;i++){
            html+=['<p>',
                '<a href="'+siteUrl+blog.app+'/detail/'+data[i]._id+'">'+data[i].title+'</a>',
            '</p>'].join('\n');
        }
        $('#randomblog').find('.panel-body').html(html);
    });
});