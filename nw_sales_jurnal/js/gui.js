/**
 * Created by boooo on 14-8-17.
 */
//设置

var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
// Get the current window
var win = gui.Window.get();
var closeGUI = function(){
    win.close();
};