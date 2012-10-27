define(function (require) {
    var plugin = require('pwz-plugin'),
        opt = require('api-config'),
        evnt = require('./web-event/events'),
        plugin = require('pwz-plugin'),
        ui = require('./web-ui/webui');

    opt.dom.box = 'js-box';
    opt.dom.boxes = 'col-main';
    opt.dom.finishBtn = 'finished-btn';

    plugin.ajaxSetup();
    ui.fInitSearchForm();
    ui.fBackTop();
    ui.fChangeCity();
    ui.fLazyLoad();
    ui.fHeaderUser();
    evnt.fInstBtn();
    ui.fInstOpenLogin();
    evnt.fOpenApi();
    evnt.fInitAttention();
});