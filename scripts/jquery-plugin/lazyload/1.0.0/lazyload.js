define(function () {
    return function (jQuery) {
        (function ($) {
            $.pdw = $.pdw || {};
            $.pdw.lazylod = $.pdw.lazylod || {};
            $.fn.lazyLoad = function (options) {
                var _defaults = {
                    urlAttr: 'data-original',
                    threshold: 0
                },
                _options = $.extend({}, _defaults, options),
                dataCache = [];
                this.each(function (i, ele) {
                    dataCache.push({
                        ele: $(this),
                        url: $(this).attr(_options.urlAttr),
                        loaded: false
                    });
                });
                function loadImages() {
                    var viewTop = $(window).scrollTop(),
                		viewBottom = viewTop + $(window).height(),
						compareTop = viewTop - _options.threshold,
						compareBottom = viewBottom + _options.threshold;
                    if (viewTop < 0) {
                        viewTop = 0;
                    }
                    $.each(dataCache, function (i, data) {
                        var ele = data.ele,
							url = data.url,
							loaded = data.loaded,
							eleTop = ele.offset().top,
							eleBottom = eleTop + ele.height();
                        if (!loaded) {
                            if (eleTop >= compareTop && eleTop <= compareBottom || eleBottom >= compareTop && eleBottom <= compareBottom) {
                                ele.attr('src', url);
                                data.loaded = true;
                            }
                        }
                        $.pdw.lazylod.resizeable = true;
                    });
                }
                $.pdw.lazylod.resizeable = true;
                $(window).scroll(loadImages);
                $(window).resize(function () {
                    if ($.pdw.lazylod.resizeable) {
                        loadImages();
                        $.pdw.lazylod.resizeable = false;
                    }
                });
                $(window).trigger('scroll');
                return this;
            }
        })(jQuery);
    }
});
