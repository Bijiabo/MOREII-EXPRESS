/**
 * Created by boooo on 14-5-22.
 */
var user = {
    cache:{},
    initProvinceAndCityData:function(){
        var provinceCount = provinceAndCityData['province'].length;
        var areaTypeCount = provinceAndCityData['province'][0].city.length;
        var areaCount = provinceAndCityData['province'][0].city[0].area.length;
        $('.user-address-province').html('');
        $('.user-address-areatype').html('');
        $('.user-address-area').html('');
        for(var i=0;i<provinceCount;i++){
            $('.user-address-province').append('<option value="'+i+'">'+provinceAndCityData['province'][i].name+'</option>');
        }
        for(var i=0;i<areaTypeCount;i++){
            $('.user-address-areatype').append('<option value="'+i+'">'+provinceAndCityData['province'][0].city[i].name+'</option>');
        }
        for(var i=0;i<areaCount;i++){
            $('.user-address-area').append('<option value="'+i+'">'+provinceAndCityData['province'][0].city[0].area[i].name+'</option>');
        }
    },
    addAddress:function(){
        var provinceIndex = Number($('#add-address .user-address-province').val());
        var provinceName = $($('#add-address .user-address-province option').get(provinceIndex)).text();
        var areaTypeIndex = Number($('#add-address .user-address-areatype').val());
        var areaTypeName = $($('#add-address .user-address-areatype option').get(areaTypeIndex)).text();
        var areaIndex = Number($('#add-address .user-address-area').val());
        var areaName = $($('#add-address .user-address-area option').get(areaIndex)).text();
        var address = $('#user-address-address').val()
        var name = $('#user-address-name').val();
        var tel = $('#user-address-tel').val();
        var addressData = {
            province:{
                name:provinceName,
                index:provinceIndex
            },
            areaType:{
                name:areaTypeName,
                index:areaTypeIndex
            },
            area:{
                name:areaName,
                index:areaIndex
            },
            address:address,
            name:name,
            tel:tel
        }
        var success = function(data){
            if(data.err===null){
                var index = $('.form-group.user-account-addressitem').length;
                $('.form-group.user-account-addressitem:last').after('<div class="form-group user-account-addressitem">\
                    <label for="address" class="col-xs-2 control-label"></label>\
                    <div class="col-xs-10">\
                        <div class="input-group">\
                            <input disabled="" type="text" value="'+provinceName+'--'+areaTypeName+'--'+areaName+'    '+address+'    '+name+'    '+tel+'" class="form-control user-account-address-input">\
                                <div class="input-group-btn">\
                                    <button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle mii-ani">编辑&nbsp;<span class="caret"></span></button>\
                                    <ul class="dropdown-menu pull-right">\
                                        <li><a href="#" data-index="'+index+'" data-province="'+provinceIndex+'" data-areatype="'+areaTypeIndex+'" data-area="'+areaIndex+'" data-address="'+address+'" data-name="'+name+'" data-tel="'+tel+'" class="user-account-modifyaddress">修改</a></li>\
                                        <li><a href="#" data-index="'+index+'" class="user-account-deleteaddress">删除</a></li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </div>');
                $('#add-address').modal('hide');
                user.initProvinceAndCityData();
            }else{
                alert('添加地址失败，请重试。');
            }
        };
        var err = function(err){
            alert('添加地址失败，请重试。');
        }
        $.ajax({
            url:siteUrl+'user/api/addAddress',
            method:'POST',
            dataType:'json',
            data:addressData,
            success:success,
            err:err
        });
    },
    deleteAddress:function(el){
        var addressIndex = Number(el.data('index'));
        var success = function(data){
            if(data.err===null){
                if(addressIndex!==0){
                    $(el.parents('.form-group')).remove();
                }else{
                    $($('.user-account-addressitem').get(1)).find('.control-label').html('<span class="visible-xs">地址</span><span class="hidden-xs">收货地址</span>');
                    $(el.parents('.form-group')).remove();
                }
            }else{
                alert('删除地址失败，请重试。');
            }
        };
        var err = function(err){
            alert('删除地址失败，请重试。');
        }
        $.ajax({
            url:siteUrl+'user/api/deleteAddress',
            method:'POST',
            dataType:'json',
            data:{addressIndex:addressIndex},
            success:success,
            err:err
        });
    },
    toModifyAddress:function(el){
        var addressIndex = Number(el.data('index'));
        user.cache.addressIndex = addressIndex;
        var provinceIndex = Number(el.data('province'));
        $('#modify-address .user-address-province').val(provinceIndex);
        $('#modify-address .user-address-areatype').html('');
        var areaTypeCount = provinceAndCityData['province'][provinceIndex].city.length;
        for(var i=0;i<areaTypeCount;i++){
            $('#modify-address .user-address-areatype').append('<option value="'+i+'">'+provinceAndCityData['province'][provinceIndex].city[i].name+'</option>');
        }
        var areaTypeIndex = Number(el.data('areatype'));
        $('#modify-address .user-address-areatype').val(areaTypeIndex);
        var areaCount = provinceAndCityData['province'][provinceIndex].city[areaTypeIndex].area.length;
        $('#modify-address .user-address-area').html('');
        for(var i=0;i<areaCount;i++){
            $('#modify-address .user-address-area').append('<option value="'+i+'">'+provinceAndCityData['province'][provinceIndex].city[areaTypeIndex].area[i].name+'</option>');
        }
        $('#modify-address .user-address-area').val(Number(el.data('area')));
        $('#user-modifyaddress-address').val(el.data('address'));
        $('#user-modifyaddress-name').val(el.data('name'));
        $('#user-modifyaddress-tel').val(el.data('tel'));
        $('#modify-address').modal('show');
    },
    modifyAddress:function(el){
        var provinceIndex = Number($('#modify-address .user-address-province').val());
        var provinceName = $($('#modify-address .user-address-province option').get(provinceIndex)).text();
        var areaTypeIndex = Number($('#modify-address .user-address-areatype').val());
        var areaTypeName = $($('#modify-address .user-address-areatype option').get(areaTypeIndex)).text();
        var areaIndex = Number($('#modify-address .user-address-area').val());
        var areaName = $($('#modify-address .user-address-area option').get(areaIndex)).text();
        var address = $('#user-modifyaddress-address').val();
        var name = $('#user-modifyaddress-name').val();
        var tel = $('#user-modifyaddress-tel').val();
        var data= {
            addressIndex:user.cache.addressIndex,
            addressData:{
                province:{
                    name:provinceName,
                    index:provinceIndex
                },
                areaType:{
                    name:areaTypeName,
                    index:areaTypeIndex
                },
                area:{
                    name:areaName,
                    index:areaIndex
                },
                address:address,
                name:name,
                tel:tel
            }
        }
        var success = function(data){
            if(data.err===null){
                $($('.user-account-address-input').get(user.cache.addressIndex)).val(provinceName+'--'+areaTypeName+'--'+areaName+'    '+address+'    '+name+'    '+tel);
                var thisBtn = $($('.user-account-modifyaddress').get(user.cache.addressIndex))
                thisBtn.data('province',provinceIndex);
                thisBtn.data('areatype',areaTypeIndex);
                thisBtn.data('area',areaIndex);
                thisBtn.data('address',address);
                thisBtn.data('name',name);
                thisBtn.data('tel',tel);
                $('#modify-address').modal('hide');
                user.initProvinceAndCityData();
            }else{
                alert('修改地址失败，请重试。');
            }
        };
        var err = function(err){
            alert('修改地址失败，请重试。');
        }
        $.ajax({
            url:siteUrl+'user/api/modifyAddress',
            method:'POST',
            dataType:'json',
            data:data,
            success:success,
            err:err
        });
    }
};
$(function(){
    $(document).on('click','#doregister',function(){
        basic.submitForm($(this),function(data){
            if(data.success=='1'){
                window.location.href = siteUrl+'user/login';
            }else{
                alert('注册失败，请检查表单后重试。');
            }
        });
    });
    $(document).on('click','#dologin',function(){
        basic.submitForm($(this),function(data){
            if(data.success=== 1){
                window.location.href = siteUrl;
            }else if(data.success === 0){
                alert(data.descriotion);
            }else{
                alert('登陆失败，请检查表单后重试。');
            }
        });
    });
    /**
     * set address
     * */
    if(provinceAndCityData){
        /**
         * add deafault data
         * */
        user.initProvinceAndCityData();
        /**
         * add select change listen
         * */
        $(document).on('change','.user-address-province',function(){
            var provinceIndex = $(this).val();
            user.cache.address = {
                province:provinceAndCityData['province'][provinceIndex].name
            };
            $('.user-address-areatype').html('');
            var areaTypeCount = provinceAndCityData['province'][provinceIndex].city.length;
            for(var i=0;i<areaTypeCount;i++){
                $('.user-address-areatype').append('<option value="'+i+'">'+provinceAndCityData['province'][provinceIndex].city[i].name+'</option>');
            }
            var areaCount = provinceAndCityData['province'][provinceIndex].city[0].area.length;
            $('.user-address-area').html('');
            for(var i=0;i<areaCount;i++){
                $('.user-address-area').append('<option value="'+i+'">'+provinceAndCityData['province'][provinceIndex].city[0].area[i].name+'</option>');
            }
        });
        $(document).on('change','.user-address-areatype',function(){
            var provinceIndex = $('.user-address-province').val();
            var areaTypeIndex = $('.user-address-areatype').val();
            $('.user-address-area').html('');
            var areaCount = provinceAndCityData['province'][provinceIndex].city[areaTypeIndex].area.length;
            for(var i=0;i<areaCount;i++){
                $('.user-address-area').append('<option value="'+i+'">'+provinceAndCityData['province'][provinceIndex].city[areaTypeIndex].area[i].name+'</option>');
            }
        });
        $(document).on('click','#user-account-addaddress',function(){
            user.addAddress();
        });
        $(document).on('click','.user-account-deleteaddress',function(){
            user.deleteAddress($(this));
        });
        $(document).on('click','.user-account-modifyaddress',function(){
            user.toModifyAddress($(this));
        });
        $(document).on('click','#user-account-modifyaddress',function(){
            user.modifyAddress($(this));
        });
    }
});