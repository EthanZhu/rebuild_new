define(function (require, exports) {
    var $ = require('jquery'),
        plugin = require('jquery-plugin/pwz-plugin/1.0.2/pwz-plugin'),
        evnt = require('./web-event/events'),
        ui = require('./web-ui/webui'),
        index = exports;
    var fInit = function(){
    	plugin.ajaxSetup();
        ui.fInstTopList();
        ui.fInstBrandList();
        ui.fInitSearchForm();
        ui.fInstBoxTips();
        ui.fIndexSlide();
        ui.fBackTop();
        ui.fChangeCity();
        ui.fLazyLoad();
        ui.fHeaderUser();
        ui.fInitIndexSlide();
        ui.flinkLine();
        ui.fInstOpenLogin();
        evnt.fInstBtn();
        evnt.fValidateMethod();
    };
    index.fInit = fInit;
});