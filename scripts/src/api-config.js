﻿define(function (require, exports) {
    var dom = {
        'topList': 'toplist',
        'brandList': 'brandlist',
        'boxes': 'js-boxes',
        'box': 'box',
        'boxImg': 'img',
        'tipsBg': 'bg',
        'tipstext': 'text',
        'userCenter': 'pdw_user_center',
        'headerUser': 'js_head_user',
        'lazyLoad': 'lazy-load',
        'currentCity': 'current_city',
        'cityTable': 'city_list',
        'cityLists': 'pdw_city_lists',
        'cityClicked': 'city-clicked',
        'changeCity': 'change-city',
        'searchForm': 'pdw-search-form',
        'searchBtn': 'pdw-search-btn',
        'couponShare': 'coupon-share',
        'footer': 'footer',
        'main': '#main_body'
    },
	api = {
	    couponUrl: '/Coupon/ObtainCoupon',
	    exgratiaUrl: '/Coupon/BuyCoupon',
	    getShopsUrl: '/Coupon/GetShops',
	    attentionUrl: '/Merchant/AttentionMerchant',
	    unAttentionUrl: '/Merchant/UnAttentionMerchant',
	    isLogin: '/User/IsLogin',
	    getMobile: '/User/GetUserDefaultMobile',
	    smsCodeUrl: '/User/GetSmsCode',
	    deleteCoupon: '/User/DelObtainCoupon',
	    IsObtainUrl: '/Coupon/IsObtain',
	    sendCouponUrl: '/User/SendObtainCoupon',
	    doLoginUrl: '/User/DoLogin'
	},
	data = {},
    myConfig = exports;

	myConfig.dom = dom;
	myConfig.api = api;
	myConfig.data = data;
});