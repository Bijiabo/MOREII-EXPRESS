/**
 * Created by boooo on 14-10-4.
 */
var moreiiServices = angular.module('moreii',['ngRoute','ui.bootstrap']);
function moreiiRouteConfig($routeProvider){
    $routeProvider
        .when('/',{
            controller:loginController,
            templateUrl:'view/hellobox.html'
        })
        .otherwise({
            redirectTo:'/'
        });
}
moreiiServices.config(moreiiRouteConfig);
function headerController($scope){
    $scope.title = 'Moreii';
    $scope.version = '1.0.1';
}
function loginController($scope){
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
            passworld:$scope.password
        });
    }
}