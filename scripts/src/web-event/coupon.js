define(function (require, exports) {
    var $ = require('jquery'),
        opt = require('api-config'),
        tools = require('./tools'),
        success = require('./success'),
        dialog = require('./../web-ui/dialog'),
        myError = require('./error'),
        myCoupon = exports,
        parentDom,
        oData,
        popup,
        sCouponType,
        couponId,
        districtId,
        mechantId,
        mobileInfo,

        mobileInput,
        codeInput,
        shopCheck,
        merchantShops,

        alertMobile,
        alertCode,
        alertCheck,

        validateCode,
        shopsData,
        $checkLists,
        shopIds = '';
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fGetCoupon = function () {
    	log('coupon:fGetCoupon')
    };

    var fCouponExgratia = function () {
    	log('coupon:fCouponExgratia')
    };

    var fCouponFree = function () {
    	log('coupon:fCouponFree')
    };

    var fCouponEvent = function () {
    	log('coupon:fCouponEvent')
    };

    var fGetShops = function () {
    	log('coupon:fGetShops')
    };

    var fGetSmsCode = function (elem) {
    	log('coupon:fGetSmsCode')
    };

    var fGetThisCoupon = function () {
    	log('coupon:fGetThisCoupon')
    };

    var fValidateMobile = function () {
    	log('coupon:fValidateMobile')
    };

    var fValidataSmsCode = function () {
    	log('coupon:fValidataSmsCode')
    };

    var fGetShopIds = function () {
    	log('coupon:fGetShopIds')
    };

    myCoupon.fGetCoupon = fGetCoupon;
    myCoupon.fCouponEvent = fCouponEvent;
});