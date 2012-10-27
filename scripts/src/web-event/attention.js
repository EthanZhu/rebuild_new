define(function (require, exports) {

    var $ = require('jquery'),
        opt = require('api-config'),
        myError = require('./error'),
        dialog = require('./../web-ui/dialog'),
        myAttention = exports;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fAttention = function () {
        log('attention:fAttention')
    };
    myAttention.fAttention = fAttention;
});