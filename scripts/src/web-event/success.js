define(function (require, exports) {
    var $ = require('jquery'),
        opt = require('api-config'),
        tools = require('./tools'),
        dialog = require('./../web-ui/dialog'),
        attention = require('./attention'),
        mySuccess = exports,
        oRoot,
        boxData;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fCouponSuccess = function () {
    	log('success:fCouponSuccess')
    };

    var fSuccessEvent = function () {
    	log('success:fSuccessEvent')
    };



    mySuccess.fCouponSuccess = fCouponSuccess;
    mySuccess.fSuccessEvent = fSuccessEvent;

});