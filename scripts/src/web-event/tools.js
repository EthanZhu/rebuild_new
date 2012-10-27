define(function (require, exports) {
    var $ = require('jquery'),
        opt = require('api-config'),
        coupon = require('./coupon'),
        open = require('./openapi'),
        attention = require('./attention'),
        dialog = require('./../web-ui/dialog'),
        ui = require('./../web-ui/webui'),
        myTools = exports;

    require('validate')($);
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fValidateMethod = function () {
    	log('tools:fValidateMethod');
    };

    var fCharlen = function (val) {
    	log('tools:fCharlen');
    };

    var fRresetCoupon = function () {
    	log('tools:fRresetCoupon');
    };

    var fLoginEvent = function () {
    	log('tools:fLoginEvent');
    };

    var fRegisterEvent = function () {
    	log('tools:fRegisterEvent');
    };

    var isLogin = function (login) {
    	log('tools:isLogin');
    };

    var fGetMobile = function () {
    	log('tools:fGetMobile');
    };

    var fInstBtn = function () {
    	log('tools:fInstBtn');
    };
    var fGetShops = function (postData) {
    	log('tools:fGetShops');
    };
    var fInstLogin = function () {
    	log('tools:fInstLogin');
    };
    var fRegister = function () {
    	log('tools:fRegister');
    };

    //validateMethod();
    myTools.fValidateMethod = fValidateMethod;
    myTools.fGetShops = fGetShops;
    myTools.fInstLogin = fInstLogin;
    myTools.fGetMobile = fGetMobile;
    myTools.isLogin = isLogin;
    myTools.fLoginEvent = fLoginEvent;
    myTools.fRegister = fRegister;
    myTools.fRegisterEvent = fRegisterEvent;
    myTools.fRresetCoupon = fRresetCoupon;
});