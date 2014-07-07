/**
 * Created by boooo on 14-6-2.
 */
$(function(){
    /**
     * add good
     * */
    $(document).on('click','#addGoodBtn',function(){
        var form = $($(this).parents('form'));
        var url = form.attr('action');
        var method = form.attr('method');
        var data = {requestType:'json'};
        var inputs = form.find('input');
            inputs.each(function(index,item){
                data[$(item).attr('name')] = $(item).val();
            });
        data['description'] = $('#description-area').val();
        data.picture = [];
        for(var i=0;i<cache.uploadImageFiles.length;i++){
            data.picture.push(cache.uploadImageFiles[i].path);
        }
        console.log(data);
        var success = function(data){
            console.log(data);
            window.location.reload();
        };
        $.ajax({
            method:method,
            url:url,
            data:data,
            dataType:'json',
            success:success
        });
    });
});