define(function (require, exports) {
    var $ = require('jquery'),
        opt = require('api-config'),
        coupon = require('./coupon'),
        tools = require('./tools'),
        open = require('./openapi'),
        attention = require('./attention'),
        myEvent = exports,
        oBoxes,
        oBox,
        oMe,
        oSelfBox,
        boxData;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var fInstBtn = function () {
    	log('events:fInstBtn')
    };
    var fInstData = function (elem) {
    	log('events:fInstData')
    };
    var fValidateMethod = function(){
    	tools.fValidateMethod();
    };
/*    var fOpenApi = function () {
        $('.' + opt.dom.couponShare).delegate('a', 'click', function (e) {
            oMe = $(this);
            e.preventDefault();
            eval('open.' + oMe.attr('data-api') + '()');
        })
    };*/
    
    var fOpenApi = function () {
    	log('events:fOpenApi')
    };

    var fInitAttention = function () {
    	log('events:fInitAttention')
    };
    
    /*
     * 倒计时功能
     * 作者：liu.my
     * 需要重写成通用组件，请相关人员及时跟进（Ethan.zhu）
     * 
     */
    var fCountDownGratia = function () {
    	log('events:fCountDownGratia')
    };

    myEvent.fInstBtn = fInstBtn;
    myEvent.fOpenApi = fOpenApi;
    myEvent.fInitAttention = fInitAttention;
    myEvent.fCountDownGratia = fCountDownGratia;
    myEvent.fValidateMethod = fValidateMethod;
});