define(function (require, exports) {
    var $ = require('jquery'),
		opt = require('api-config'),
        myUi = exports;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var flinkLine = function () {
    	log('ui:flinkLine');
    };

    var fInitIndexSlide = function () {
    	log('ui:fInitIndexSlide');
    };

    var fInstTopList = function () {
    	log('ui:fInstTopList');
    };

    var fInstBrandList = function () {
    	log('ui:fInstBrandList');
    };

    var fInitSearchForm = function () {
    	log('ui:fInitSearchForm');
    };

    var fInstBoxTips = function () {
    	log('ui:fInstBoxTips');
    };

    var fIndexSlide = function () {
    	log('ui:fIndexSlide');
    };

    var fBackTop = function () {
    	log('ui:fBackTop');
    };

    var fLazyLoad = function () {
    	log('ui:fLazyLoad');
    };

    var fChangeCity = function () {
    	log('ui:fChangeCity');
    };

    var fHeaderUser = function () {
    	log('ui:fHeaderUser');
    };

    var fHeadHtml = function (uname) {
    	log('ui:fHeadHtml');
    };

    var fPayPrice = function () {
    	log('ui:fPayPrice');
    };

    var fInstOpenLogin = function () {
    	log('ui:fInstOpenLogin');
    };

    //fInstOpenLogin();
    myUi.flinkLine = flinkLine;
    myUi.fInstOpenLogin = fInstOpenLogin
    myUi.fHeadHtml = fHeadHtml;
    myUi.fHeaderUser = fHeaderUser;
    myUi.fPayPrice = fPayPrice;
    myUi.fInstTopList = fInstTopList;
    myUi.fInstBrandList = fInstBrandList;
    myUi.fInitSearchForm = fInitSearchForm;
    myUi.fInstBoxTips = fInstBoxTips;
    myUi.fIndexSlide = fIndexSlide;
    myUi.fBackTop = fBackTop;
    myUi.fChangeCity = fChangeCity;
    myUi.fLazyLoad = fLazyLoad;
    myUi.fInitIndexSlide = fInitIndexSlide;
});