define(function (require, exports) {
    var $ = require('jquery'),
        myApi = exports;
    var log = function(str){
    	$('body').append('<p>'+str+'</p>');
    };
    var openAPILogin = function (e) {
    	log('openapi:openAPILogin')
    };

    var fOpenLoginEvent = function () {
        var ulLogin = $('ul.open-login');
        if (typeof ulLogin[0] !== 'undefined') {
            $('ul.open-login').click(openAPILogin);
        }
    };

    var qzone = function (pic, title, dec, summary) {
        var url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(location.href)
                 + "&title=" + encodeURIComponent(title)
                 + "&pics=" + encodeURIComponent(pic)
                 + "&summary=" + encodeURIComponent(summary)
                 + "&desc=" + encodeURIComponent(dec);
        window.open(url);
    };

    var sina = function (pic, title) {
        var url = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent("http://www.paidui.cn")
            + "&appkey=1661501805&title=" + encodeURIComponent(title)
            + "&pic=" + encodeURIComponent(pic) + "&ralateUid=2604544522&language=zh_cn";
        window.open(url);
    };

    var renren = function (pic, title, dec, content) {
        var url = "http://widget.renren.com/dialog/share?url=" + encodeURIComponent(location.href)
            + "&title=" + encodeURIComponent(title)
            + "&pic=" + encodeURIComponent(pic)
            + "&description=" + encodeURIComponent(dec)
            + "&content=" + encodeURIComponent(content);
        window.open(url);
    };

    var tencent = function (pic, title) {
        var url = "http://share.v.t.qq.com/index.php?c=share&a=index&appkey=100269912&url=" + encodeURIComponent(location.href)
            + "&title=" + encodeURI(title).replace(new RegExp("#", "gm"), "%23")
            + "&pic=" + encodeURIComponent(pic);
        window.open(url);
    };

    var doqzone = function () {
        var pic = $("#imgDraw").attr("src");
        var title = $("#fxTitle").attr("merchant_name") + "!" + $("#fxTitle").attr("coupon_name");
        qzone(pic, title, "", "");
    };

    var dosina = function () {
        var pic = $("#imgDraw").attr("src");
        var title = $("#fxTitle").attr("merchant_name") + "!" + $("#fxTitle").attr("coupon_name");
        sina(pic, title);
    };

    var dorenren = function () {
        var pic = $("#imgDraw").attr("src");
        var title = $("#fxTitle").attr("merchant_name") + "!" + $("#fxTitle").attr("coupon_name");
        renren(pic, title, " ", " ");
    };

    var dotencent = function () {
        var pic = $("#imgDraw").attr("src");
        var title = $("#fxTitle").attr("merchant_name") + "!" + $("#fxTitle").attr("coupon_name") + "（分享自 @@@@paiduiwang2011）";
        tencent(pic, title);
    };

    fOpenLoginEvent();
    myApi.doqzone = doqzone;
    myApi.dosina = dosina;
    myApi.dorenren = dorenren;
    myApi.dotencent = dotencent;
    myApi.openAPILogin = openAPILogin;
});