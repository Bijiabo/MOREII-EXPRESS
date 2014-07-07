/**
 * Created by boooo on 14-6-11.
 */
var shop = {
    cache:{},
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
    confirmOrder:function(el){
        shop.cache.order={
            goodId:shop.cache.goodId,
            count:Number($(el.parents('form').find('input[name="goodcount"]')).val())
        };
        $('#confirm-order-goodcount').text(shop.cache.order.count);
        $('#confirm-order-price').text(shop.cache.order.count*shop.cache.goodPrice);
        $('#confirm-order').modal('show');
    },
    toconfirmAddress:function(el){
        $('#confirm-order').modal('hide');
        $('#confirm-address').modal('show');
        var addressCache = '';
        var success = function(data){
            if(data.err===null){
                $('#confirm-address-body').html('');
                for(var i=0;i<data.data.address.length;i++){
                    addressCache = data.data.address[i].province.name+'  '+data.data.address[i].areaType.name+'  '+data.data.address[i].area.name+'  '+data.data.address[i].address+'  '+data.data.address[i].name+'  '+data.data.address[i].tel;
                    $('#confirm-address-body').append('<div class="input-group form-group">\
                        <span class="input-group-addon">\
                        <input type="radio" name="confirm-address" value="'+addressCache+'" data-index="'+i+'">\
                        </span>\
                        <input type="text" class="form-control" value="'+addressCache+'" disabled>\
                        </div>');
                }
                $('#confirm-address-body').append('<div class="form-group">\
                        <input class="btn btn-default" value="使用新地址" type="button">\
                        </div>');
                $('#confirm-address-body input[name="confirm-address"]:first').attr('checked','checked');
            }else{
                alert('系统错误，请稍后重试:(');
            }
        }
        var err = function(err){
            alert('系统错误，请稍后重试:(');
        }
        $.ajax({
            url:siteUrl+'user/api/getOwnInfo',
            dataType:'json',
            success:success,
            err:err
        })
    },
    confirmAddress:function(el){
        var address = $('input[name="confirm-address"]:checked').val();
        shop.cache.order.addressIndex = $('input[name="confirm-address"]:checked').data('index');
        $.ajax({
            method:'POST',
            url:siteUrl+'shop/api/addOrder',
            dataType:'json',
            data:{
                goodID:shop.cache.goodID,
                count:shop.cache.order.count,
                remark:''
            },
            success:function(data){
                console.log(data);
            },
            error:function(err){
                console.log(err);
            }
        })
    }
}
$(function(){
    /**
     * init list picture
     * */
    var listImages = $('.shop-list-pic');
    var listImagesCount = listImages.length;
    var listImagesCache = {};
    var listImagesLoaded = 0;
    for(var i=0;i<listImagesCount;i++){
        listImagesCache[i] = new Image();
        listImagesCache[i].src = $(listImages.get(i)).attr('src');
        listImagesCache[i].onload = function(){
            listImagesLoaded++;
            if(listImagesLoaded===listImagesCount){
                var container = document.querySelector('#shop-goodlist');
                var msnry = new Masonry( container, {
                    itemSelector: '.shop-list-item'
                });
            }
        }
    }

    /**
     * add listen
     * */
    $(document).on('click','#comment-submit',function(){
        shop.submitComment($(this));
    });
    $(document).on('keydown','#comment-content',function(e){
        if(e.keyCode===13){
            shop.submitComment($(this));
        }
    });
    $(document).on('click','.shop-btn-buynow',function(){
        shop.confirmOrder($(this));
    });
    $(document).on('click','#shop-btn-toconfirmaddress',function(){
        shop.toconfirmAddress($(this));
    });
    $(document).on('click','#shop-btn-confirmaddress',function(){
        shop.confirmAddress($(this));
    });
});