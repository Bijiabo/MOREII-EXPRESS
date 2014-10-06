/**
 * Created by boooo on 14-10-4.
 */
var severUrl = 'http://192.168.0.102:3001';
var moreiiServices = angular.module('moreii',['ngRoute','ui.bootstrap']);
function moreiiRouteConfig($routeProvider,$httpProvider){
    $routeProvider
        .when('/',{
            templateUrl:'view/hellobox.html'
        })
        .otherwise({
            redirectTo:'/'
        });
}
moreiiServices.config(moreiiRouteConfig);
//添加过滤器
moreiiServices.filter('mailName',function(){
    //匹配邮箱名
    return function(emailAddress){
        if(emailAddress){
            if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(emailAddress)){
                return emailAddress.replace(/\@.*$/,'');
            }else{
                return null;
            }
        }
    }
})
//封装$http服务
moreiiServices.factory('$miihttp',function($http){
    var miihttp = {
        post:function(url,data,config,callback){
            var promise = $http.post(url,data,config),
                p = promise;
            promise.then(function(resp){
                return callback(resp);
            },function(resp){
                console.log(resp);
                if(resp.status===403){
                    console.log(resp.status);
                    $http.get(severUrl+'/getCsrfToken').then(function(resp){
                        data._csrf = resp.data.token;
                        $http.post(url,data,config).then(function(resp){
                            return callback(resp);
                        },function(resp){
                            return  callback(resp);
                        });
                    },function(resp){
                        return callback(resp);
                    });
                }else{
                    return callback(resp);
                }
            });
        }
    };
    return miihttp;
});

//fengjiejie
/*
wb_shop.factory('$wb_http', function($http, $resource) {
    var _conf = wb_shop.config,
        _data = { call : 'JSON_CALLBACK' },
        _base = _conf.baseJsonpUrl,
        _api  = _conf.baseApiUrl

    return {
        api : function(url, obj) {
            var params = angular.copy(_data, {})

            params = angular.extend(params, obj)

            return $http.jsonp(_api+url, {
                params : params
            })
        },

        get : function(url, obj) {
            var params = angular.copy(_data, {})

            params = angular.extend(params, obj)

            return $http.jsonp(_base+url, {
                params : params
            })
        },

        res : function(url, obj) {
            var params = angular.copy(_data, {})

            return $resource(_base+url, {}, {
                query: {
                    method: 'JSONP',
                    params: angular.extend(params, (obj && obj.data) ? obj.data : {}),
                    isArray: (obj && obj.isArray != undefined) ? obj.isArray : true,
                    transformResponse: (obj && obj.transform) ? obj.transform : function(data) {
                        var r_code = data['R_CODE'], r_cursor = data['R_CURSOR']

                        return (r_code < 0) ? [] : (r_cursor?r_cursor:data)
                    }
                }
            }).query()
        }
    }
})
easyBuy : function(goodid, itemid, goodqty) {
    var deferred = $q.defer()

    UserServ.getLogin().then(function(data) {
        if (data['UID'] == 0) {
            deferred.resolve({
                'R_CODE' : -1000,
                'R_TIP'  : '未登录，请先登录！'
            })
        } else {
            $wb_http.get(_url_easy, {
                good_id : goodid,
                item_id : itemid,
                qty     : goodqty
            }).success(function(data) {
                if (data['R_CODE'] < 0) {
                    deferred.resolve({
                        'R_CODE' : -1000,
                        'R_TIP'  : data['R_TIP']
                    })
                } else {
                    deferred.resolve({
                        'R_CODE' : 1000,
                        'R_TIP'  : '一键购订单提交成功'
                    })
                }
            })
        }
    })

    return deferred.promise
}
*/

//fengjiejie end
//控制器
function headerController($scope,$http){
    $scope.title = 'Moreii';
    $scope.version = '1.0.1';
}
moreiiServices.controller('loginController',function($scope,$http,$miihttp){
    $scope.checkAccount = function(){
        if($scope.account===''){
            $scope.tip = '请输入账户';
        }else{
            $scope.tip = '';
        }
    }
    $scope.checkPassword= function(){
        if($scope.account===''){
            $scope.tip = '请输入账户';
        }else if($scope.password==='') {
            $scope.tip = '请输入密码';
        }else if($scope.password.length <6){
            $scope.tip = '密码长度需大于6位'
        }else{
            $scope.tip = '';
        }
    }
    $scope.doLogin = function(){
        console.log({
            account:$scope.account,
            passworld:basic.pwdencode($scope.password)
        });
        $miihttp.post(severUrl+'/api/login',{
            account:$scope.account,
            password:basic.pwdencode($scope.password)
        },{},function(resp){
            console.log(resp);
        });
    }
});