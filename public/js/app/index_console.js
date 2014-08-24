/**
 * Created by boooo on 14-8-24.
 */
$(function(){
    $(document).on('click','#index-add-picture .dz-details',function(event){
        console.log($(this).find('.dz-filename .fa').data('file-path'));
    });
})