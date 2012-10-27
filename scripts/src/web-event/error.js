define(function (require, exports) {
    var $ = require('jquery'),
        tools = require('./tools'),
        myError = exports;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fInitError = function (dt, type) {
    	log('error:fInitError')
    };

    myError.fInitError = fInitError;
});