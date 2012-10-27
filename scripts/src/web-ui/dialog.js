define(function (require, exports) {
    var $ = require('jquery'),
        opt = require('api-config'),
        coupon = require('./../web-event/coupon'),
        success = require('./../web-event/success'),
        tools = require('./../web-event/tools'),
        ftData,
        boxData,
        mobileInfo,
        myDialog = exports;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fCouponHtml = function () {
    	log('dialog:fCouponHtml');
    };
    var fSuccessHtml = function () {
    	log('dialog:fSuccessHtml');
    };
    var fLoginHtml = function () {
    	log('dialog:fLoginHtml');
    };
    var fRegisterHtml = function () {
    	log('dialog:fRegisterHtml');
    };
    myDialog.fCouponHtml = fCouponHtml;
    myDialog.fSuccessHtml = fSuccessHtml;
    myDialog.fLoginHtml = fLoginHtml;
    myDialog.fRegisterHtml = fRegisterHtml;
});