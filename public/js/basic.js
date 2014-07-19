/**
 * Created by boooo on 14-5-20.
 */
var cache = {
    uploadImageFiles:[],
    login:false
};
var basic = {
    ready:function(){
        $('.mii-jshide').hide();
        $('.mii-jsshow').removeClass('jsshow');
    },
    pwdencode:function(password){
        /*
         *
         * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
         * in FIPS PUB 180-1
         *
         * By lizq
         *
         * 2006-11-11
         *
         */
        /*
         *
         * Configurable variables.
         *
         */
        var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
        var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */
        /*
         *
         * The main function to calculate message digest
         *
         */
        function hex_sha1(s){

            return binb2hex(core_sha1(AlignSHA1(s)));

        }

        /*
         *
         * Perform a simple self-test to see if the VM is working
         *
         */
        function sha1_vm_test(){

            return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";

        }

        /*
         *
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         *
         */
        function core_sha1(blockArray){

            var x = blockArray; // append padding
            var w = Array(80);

            var a = 1732584193;

            var b = -271733879;

            var c = -1732584194;

            var d = 271733878;

            var e = -1009589776;

            for (var i = 0; i < x.length; i += 16) // 每次处理512位 16*32
            {

                var olda = a;

                var oldb = b;

                var oldc = c;

                var oldd = d;

                var olde = e;

                for (var j = 0; j < 80; j++) // 对每个512位进行80步操作
                {

                    if (j < 16)
                        w[j] = x[i + j];

                    else
                        w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

                    var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));

                    e = d;

                    d = c;

                    c = rol(b, 30);

                    b = a;

                    a = t;

                }

                a = safe_add(a, olda);

                b = safe_add(b, oldb);

                c = safe_add(c, oldc);

                d = safe_add(d, oldd);

                e = safe_add(e, olde);

            }

            return new Array(a, b, c, d, e);

        }

        /*
         *
         * Perform the appropriate triplet combination function for the current
         * iteration
         *
         * 返回对应F函数的值
         *
         */
        function sha1_ft(t, b, c, d){

            if (t < 20)
                return (b & c) | ((~ b) & d);

            if (t < 40)
                return b ^ c ^ d;

            if (t < 60)
                return (b & c) | (b & d) | (c & d);

            return b ^ c ^ d; // t<80
        }

        /*
         *
         * Determine the appropriate additive constant for the current iteration
         *
         * 返回对应的Kt值
         *
         */
        function sha1_kt(t){

            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;

        }

        /*
         *
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         *
         * to work around bugs in some JS interpreters.
         *
         * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
         *
         */
        function safe_add(x, y){

            var lsw = (x & 0xFFFF) + (y & 0xFFFF);

            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

            return (msw << 16) | (lsw & 0xFFFF);

        }

        /*
         *
         * Bitwise rotate a 32-bit number to the left.
         *
         * 32位二进制数循环左移
         *
         */
        function rol(num, cnt){

            return (num << cnt) | (num >>> (32 - cnt));

        }

        /*
         *
         * The standard SHA1 needs the input string to fit into a block
         *
         * This function align the input string to meet the requirement
         *
         */
        function AlignSHA1(str){

            var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16);

            for (var i = 0; i < nblk * 16; i++)
                blks[i] = 0;

            for (i = 0; i < str.length; i++)

                blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);

            blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);

            blks[nblk * 16 - 1] = str.length * 8;

            return blks;

        }

        /*
         *
         * Convert an array of big-endian words to a hex string.
         *
         */
        function binb2hex(binarray){

            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";

            var str = "";

            for (var i = 0; i < binarray.length * 4; i++) {

                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +

                    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);

            }

            return str;

        }

        /*
         *
         * calculate MessageDigest accord to source message that inputted
         *
         */
        function calcDigest(){

            var digestM = hex_sha1(document.SHAForm.SourceMessage.value);

            document.SHAForm.MessageDigest.value = digestM;

        }
        return hex_sha1(password);
    },
    submitForm:function(el,success,error){
        var form = $(el.parents('form'));
        var url = form.attr('action');
        var method = form.attr('method');
        var data = {requestType:'json'};
            var inputs = form.find('input');
            inputs.each(function(index,item){
                data[$(item).attr('name')] = $(item).val();
            });
        $.ajax({
           method:method,
            url:url,
            data:data,
            dataType:'json',
            success:function(data){
                success(data);
            },
            error:function(err){
                if(error){
                    error(err);
                }
            }
        });
    },
    uploadGoodImage:function(){
        $("div#uploadImageDropbox").dropzone({
            url: "/api/uploadGoodImage",
            paramName: "file",
            maxFilesize: 2,
            acceptedFiles:'image/*',
            addRemoveLinks:true,
            success:function(file,data){
                data = JSON.parse(data);
                cache.uploadImageFiles.push({originalname:file.name,path:data.path});
                /**
                 * default skin
                 * */
                if (file.previewElement) {
                    return file.previewElement.classList.add("dz-success");
                }
            },
            removedfile:function(file){
                for(var i=1;i<cache.uploadImageFiles.length;i++){
                    if(cache.uploadImageFiles[i].originalname === file.name){
                        cache.uploadImageFiles.splice(i,1);
                        break;
                    }
                }
                var _ref;
                if (file.previewElement) {
                    if ((_ref = file.previewElement) != null) {
                        _ref.parentNode.removeChild(file.previewElement);
                    }
                }
            }
        });
    },
    getComment:function(skip,limit){
        var commentList = $('#comment-list');
        if(commentList.length>0){
            if(!skip){var skip=0;}
            if(!limit){var limit=10;}
            var success = function(data){
                commentList.html('');
                if(data.err==null){
                    for(var i=0;i<data.data.length;i++){
                        commentList.append('<div class="media">\
                        <a class="pull-left" href="#">\
                            <img class="media-object" src="\
                            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACdElEQVR4Xu2Y229pQRTGv0ZcIhKKkCDUNUg8EOGFP7/iTurBNQT1QEKDCkH1nDWJ5jhJT8/Z+7Rp7DUvfZlZM+vb33y/mpvFYvEKBY8bFoAdwFeAM0DBGQgOQaYAU4ApwBRgCihYAcYgY5AxyBhkDCoYAvxjiDHIGGQMMgYZg4xBBSvAGJSLwc1mg1arhfV6Da1Wi0gkApPJdOGp8XiMdruNWCwGu93+od8+o+Z7m8pywPF4RC6Xg0qlQiAQQL/fx8vLCzKZzNt+y+USlUoFp9PprwT4jJp/UlyWALPZDA8PDwiHw3C5XNhut0IAg8Eg9jwcDigUCtBoNFitVm8CDIdDdLtd+Hw+uN1uMYfWpdNpkGBSan5oq3cmyBLg3IjVahVXQK1WIxQKwWw2i+3q9boQgRqt1WoXDqhWq3h6ehJz5/M54vE4LBYL5NSUIsJ/EYAO7vf70ev1xBfMZrN4fHzEYDBAIpHAbrdDo9FANBoVGUBXZr/fI5/Pi78ejwfBYFCc/yyAlJpfLsB0OhWNUfA5nU5MJhM0m02kUikReiTG7+N8XSjoisWisD65gISiIafmlwtA9r6/vxfpTzYfjUagxigEn5+fRXM06HqQO7xerxCKMqFUKonMcDgcYh2F6N3dnbgyUmrqdDop/ct/D6Cv3Ol0RMN6vV5kwO3t7cVh6I7/mgE0n5omLNpsNpTLZRGSyWQSRqNROOdfa0rq/uciWRkgddPvtI4FkPuf4Hf6mlLOwg5gB/CTGD+J8ZOYlPS8ljVMAaYAU4ApwBS4lkSX0gdTgCnAFGAKMAWkpOe1rGEKMAWYAkwBpsC1JLqUPhRPgR/pSmaf3gIvkAAAAABJRU5ErkJggg==\
                            " alt="'+data.data[i].userData.name+'">\
                            </a>\
                            <div class="media-body">\
                            <h4 class="media-heading">'+data.data[i].userData.name+'</h4>\
                                '+data.data[i].content+'\
                        </div>\
                        </div>');
                    }
                }

            }
            $.ajax({
                method:'GET',
                url:commentList.data('url')+skip+'/'+limit,
                dataType:'json',
                success:success,
                error:function(err){console.log(err);}
            })
        }
    },
    checkLogin:function(){
        $.ajax({
            method:'GET',
            url:siteUrl+'api/iflogin',
            dataType:'json',
            success:function(data){
                if(data.login===true){
                    $('#header-user-name').text(data.userInfo.name);
                    $('#header-login').hide();
                    $('#header-user,#header-messagebox').fadeIn();
                    cache.login = true;
                    basic.checkMessageBox();
                }else{
                    cache.login = false;
                }
            },
            err:function(){
                setTimeout(function(){basic.checkLogin();},1000);
            }
        })
    },
    setAppLink:function(){
        if($('.applink').length>0){
            $('.applink').removeClass('active');
            $('.applink-'+app).addClass('active');
        }
    },
    checkMessageBox:function(){
        if(cache.login){
            console.log('logined');
            $.ajax({
               url:siteUrl+'notice/api/getUnread',
                method:'GET',
                dataType:'json',
                success:function(data){
                    if(!data.err){
                        if(data.data.length>0){
                            $('#modal-loading').hide();
                            $('#header-messagebox-light').fadeIn();
                            var listTable = $('#messageboxlist>table>tbody');
                            listTable.html('');
                            for(var i= 0,dLength=data.data.length;i<dLength;i++){
                                listTable.append([
                                    '<tr>',
                                        '<td class="tablecheckbox">',
                                            '<input type="checkbox",value="'+data.data[i]._id+'">',
                                        '</td>',
                                        '<td>',
                                            data.data[i].content,
                                        '</td>',
                                        '<td>',
                                            data.data[i].app,
                                        '</td>',
                                    '</tr>'].join('\n'));
                            }
                        }else{
                            $('#modal-loading').hide();
                            $('#header-messagebox-light').fadeIn();
                            var listTable = $('#messageboxlist>table>tbody');
                            listTable.html('<tr><td></td><td>暂无未读消息。</td></tr>');
                        }
                    }
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    }
}