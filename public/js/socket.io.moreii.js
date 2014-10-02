/**
 * Created by boooo on 14-10-2.
 */
var socket_notice = io.connect('http://'+domain+':'+(port+1)+'/notice');
socket_notice.on('connect', function () {
    socket_notice.emit('hi!');
});
socket_notice.on('notice',function(data){
    console.log(data);
})