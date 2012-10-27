define(function (require, exports) {
    var $ = require('jquery');
    require('contentShown')($);
    require('./lazyload/1.0.0/lazyload')($);
    require('./backtop/1.0.0/backtop')($);
    require('./dialog/1.0.0/dialog')($);
    require('./cookie/1.2.0/cookie')($);
    require('./indexSlide/1.0.0/indexSlide')($);
    var ajaxSetup = function () {
        $.ajaxSetup({
            cache: false,
            type: "POST",
            beforeSend: function (x) {
                x.setRequestHeader("ajax", "true");
            },
            error: function (x, y, z) {
                var response = $.parseJSON(x.responseText);
                if (response.status != 1) {
                    $("#msg").text(response.data).show();
                }
            }
        });
    };

    exports.ajaxSetup = ajaxSetup;
});
