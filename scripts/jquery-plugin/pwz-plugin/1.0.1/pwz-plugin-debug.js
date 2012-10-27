define("jquery-plugin/pwz-plugin/1.0.1/lazyload/1.0.0/lazyload-debug", [], function () {
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


/******************************************
* jq.pdwBackTop.js
*
* @author          Ethan.Zhu（zhuyidong）
* @version         Version 1.0
* @copyright       Copyright (c) 2012 Ethan.Zhu
* 
* @email			zhu.yd@paidui.cn
* use $pdw.backTop();
******************************************/
define("jquery-plugin/pwz-plugin/1.0.1/backtop/1.0.0/backtop-debug", [], function () {
    return function (jQuery) {

        (function ($) {
            $.pdw = $.pdw || {};
            $.pdw.backTop = function (o) {
                var configs = {
                    adsorption: true,
                    mainWidth: 960,
                    offsetX: 10,
                    minScrollTop: 100,
                    bottom: 20,
                    ftHeight: 154, //底部高度
                    btopHeight: 50,
                    btopWidth: 55,
                    sDuration: 500,
                    animate: false,
                    footerId: '#footer'
                },
                ndWin = $(window),
                doc = $(document),
                wrapper = $('body'),
                $backTop,
                scrollTimer,
                footerPosY,
                offsetx,
                winHeight = ndWin.height(),
                winWidth = ndWin.width(),
                docHeight = doc.height(),
                right, mainWidth, btopWidth, btopHeight,
                resized = false, oFooter,
                ua;
                o = $.extend(configs, o);
                oFooter = $(o.footerId);
                if (typeof oFooter[0] !== 'undefined') {
                    o.ftHeight = oFooter.innerHeight();
                }
                offsetx = o.offsetX;
                mainWidth = o.mainWidth;
                btopWidth = o.btopWidth;
                btopHeight = o.btopHeight;

                if (!window.XMLHttpRequest) {
                    ua = 'ie6';
                }

                if (typeof $('#back_top')[0] != 'undefined') {
                    $backTop = $('#back_top');
                }
                else {
                    $backTop = createBackTop();
                }
                footerPosY = docHeight - o.ftHeight;

                right = offsetx;
                getBackTopRight();

                $backTop.css({ 'right': right, 'bottom': o.bottom + 'px' }); //.setStyle('bottom', o.bottom + 'px');


                getBackTopRight();
                handleScroll();
                //考虑小屏幕
                function getBackTopRight() {
                    if (o.adsorption) {
                        right = winWidth <= (mainWidth + (btopWidth + offsetx) * 2) ? offsetx : parseInt((winWidth - mainWidth) / 2) - offsetx - btopWidth;
                        $backTop.css('right', right);
                    }
                }

                ndWin.on('scroll.backtop', handleScroll);
                ndWin.on('resize.backtop', function () {
                    if (resized) {
                        return;
                    }
                    resized = true;
                    scrollTimer = setTimeout(function () {
                        handleResize();
                    }, 50);
                });
                $backTop.on('click', function (e) {
                    e.preventDefault();
                    if (o.animate) {
                        $('html,body').animate({ scrollTop: 0 }, 150);
                    }
                    else {
                        $(document).scrollTop(0);
                    }
                });


                // 处理滚动
                function handleScroll() {
                    var st = doc.scrollTop(),
                    top,
                    bottom,
                    scrolled = st + winHeight,
                    // 超出下限位置的高度
                    exceedFloor;

                    //if (PDW.singlePage) {//独立无刷新页面需要重新计算高度。
                    //alert(111);
                    docHeight = doc.height();
                    footerPosY = docHeight - o.ftHeight;
                    // }

                    if (st < o.minScrollTop) {
                        if ($backTop.css('display') === 'block') {
                            $backTop.hide();
                        }
                        return;
                    }
                    $backTop.css('display', 'block');
                    exceedFloor = scrolled - footerPosY;

                    if (ua && ua == 'ie6') {
                        top = scrolled - btopHeight - o.bottom;
                        if (exceedFloor > 0) {
                            top -= exceedFloor;
                        }
                        $backTop.css({ "top": top, 'position': 'absolute' });
                    }
                    else {
                        bottom = o.bottom;
                        if (exceedFloor > 0) {
                            bottom += exceedFloor;
                        }
                        $backTop.css('bottom', bottom + 'px');
                    }
                }

                // 处理窗口大小变化
                function handleResize() {
                    //alert('执行一次');
                    if (scrollTimer) {
                        clearTimeout(scrollTimer);
                    }
                    winHeight = ndWin.height();
                    winWidth = ndWin.width();
                    getBackTopRight();
                    handleScroll();
                    resized = false;
                }

                //创建backtop节点
                function createBackTop() {
                    var nd = $('<a id="back_top" class="backtop" hidefocus="true" href="#" style="display:none">回顶部</a>');
                    wrapper.append(nd);
                    return nd;
                }

            }
        })(jQuery);
        //$.pdw.backTop();
    }
});

define("jquery-plugin/pwz-plugin/1.0.1/dialog/1.0.0/dialog-debug", [], function (require) {
    return function (jQuery) {
    	(function($){
    		$.pdw = $.pdw || {};
	        $.pdw.Dialog = function () {
	            $('<div class="popup-overlay" style="display:none;"><iframe src="about:blank" frameborder="0"></iframe></div>').appendTo(document.body);
	            var textArr = [];
	            var _this = this;
	            textArr.push('<div class="popup" style="display:none;">');
	            textArr.push('<h5 class="popup-title"></h5>');
	            textArr.push('<a href="#" class="times"></a>');
	            textArr.push('<div class="popup-box-bd">');
	            textArr.push('<div class="popup-box-cnt"></div>');
	            textArr.push('<div class="popup-box-btns"></div>');
	            textArr.push('</div></div>');
	            $(textArr.join('')).appendTo(document.body);
	            this.rootEle = $('div.popup');
	            this.title = $('.popup-title', this.rootEle);
	            this.cnt = $('div.popup-box-cnt', this.rootEle);
	            this.closer = $('a.times', this.rootEle);
	            this.overlay = $('div.popup-overlay');
	            this.overlayIframe = $('iframe', this.overlay);
	            this.btnsContainer = $('div.popup-box-btns', this.rootEle);
	            this.defaultOpts = {
	                width: 380,
	                height: 160,
	                title: ' ',
	                needTitle: true,
	                success: function () { }
	            }
	            this.init();
	        }
	
	        $.pdw.Dialog.prototype.init = function () {
	            var _this = this;
	            this.closer.click(function () {
	                _this.close();
	                return false;
	            });
	        }
	
	        $.pdw.Dialog.prototype.open = function (opts) {
	            var _this = this;
	            var openOpts = {};
	            var bd;
	            this.inst = true;
	            if (opts) {
	                $.extend(openOpts, this.defaultOpts, opts);
	            }
	            if (openOpts.text) {
	                this.cnt.html('<div class="text-bd">' + openOpts.text + '</div>');
	                this.rootEle.css({ width: openOpts.width });
	                if (!openOpts.btns) {
	                    openOpts.btns = [{
	                        text: '确 定',
	                        fun: function () {
	                            _this.close();
	                        }
	                    }]
	                }
	            } else if (openOpts.info) {
	                this.cnt.html('<div class="info-bd-wrapper"><span class="info-ico"></span><span class="info-cnt">' + openOpts.info + '</span></div>');
	                this.rootEle.css({ width: openOpts.width });
	                if (!openOpts.btns) {
	                    openOpts.btns = [{
	                        text: '确 定',
	                        fun: function () {
	                            _this.close();
	                        }
	                    }]
	                }
	            } else if (openOpts.id) {
	                this.cnt.html($(openOpts.id).val());
	                this.rootEle.css({ width: opts.width ? opts.width : 'auto' });
	                this.rootEle.css({ height: opts.height ? opts.height : 'auto' });
	            } else if (openOpts.html) {
	                this.cnt.html(openOpts.html);
	                this.rootEle.css({ width: opts.width ? opts.width : 'auto' });
	                this.rootEle.css({ height: opts.height ? opts.height : 'auto' });
	            } else if (openOpts.iframe) {
	                this.cnt.html('<iframe src="' + openOpts.iframe + '" frameborder="0" width="1" height="0"></iframe><div class="popup-loading">正在加载</div>');
	                //this.rootEle.css({width:openOpts.width, height: openOpts.height});
	                this.iframe = $('iframe', this.rootEle);
	                this.popupLoading = $('div.popup-loading', this.rootEle);
	                this.iframe.load(function () {
	                    var iframe = this;
	                    try {
	                        var bHeight = iframe.contentWindow.document.body.scrollHeight;
	                        var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
	                        var height = Math.max(bHeight, dHeight);
	                        iframe.height = height;
	                        var bWidth = iframe.contentWindow.document.body.scrollWidth;
	                        var dWidth = iframe.contentWindow.document.documentElement.scrollWidth;
	                        var width = Math.max(bWidth, dWidth);
	                        iframe.width = width;
	                        _this.popupLoading.hide();
	                        _this.iframe.show();
	                        // iframe加载完毕之后重新设置弹出层的位置
	                        _this.rootEle.css({
	                            marginLeft: -Math.floor(_this.rootEle.width() / 2),
	                            marginTop: -Math.floor(_this.rootEle.height() / 2) + Math.max($(document.documentElement).scrollTop(), $(document.body).scrollTop())
	                        });
	                    } catch (ex) {
	                        _this.popupLoading.hide();
	                        _this.iframe.show();
	                        iframe.width = openOpts.iframeWidth;
	                        iframe.height = openOpts.iframeHeight;
	                        _this.rootEle.css({
	                            marginLeft: -Math.floor(_this.rootEle.width() / 2),
	                            marginTop: -Math.floor(_this.rootEle.height() / 2) + Math.max($(document.documentElement).scrollTop(), $(document.body).scrollTop())
	                        });
	                    }
	                })
	            }
	            // 设置按钮
	            this.btnsContainer.html('').hide();
	            if (openOpts.btns) {
	                var that = this;
	                var cancelBtn = "";
	                // //console.log(that);
	                for (var i = 0; i < openOpts.btns.length; i++) {
	                    if (openOpts.btns[i].text == "取 消" || openOpts.btns[i].text == "取消") {
	                        cancelBtn = "gray-sm-btn"
	                    }
	                    $('<button type="button" class="blue-sm-btn ' + cancelBtn + '" />')
	                .html(openOpts.btns[i].text)
	                .click($.proxy(openOpts.btns[i].fun, that))
	                .appendTo(this.btnsContainer);
	                    this.btnsContainer.show();
	                }
	            }
	            //设置位置
	            this.setPlace(this.rootEle)
	
	            //填入标题
	            if (openOpts.needTitle) {
	                this.title.html(openOpts.title).show(); ;
	                this.rootEle.removeClass('popup-notitle');
	            } else {
	                this.title.hide();
	                this.rootEle.addClass('popup-notitle');
	            }
	            // 设置遮罩层的高度
	            var height = Math.max($(window).height(), $(document).height());
	            this.overlay.css('height', height);
	            this.overlayIframe.attr('height', height);
	            // 在关闭按钮上绑定事件
	            if (openOpts.close) {
	                this.closer.click(openOpts.close);
	            }
	            bd = $('.popup-box-bd', this.rootEle);
	            // 显示弹出层
	            this.overlay.show();
	            this.rootEle.show();
	
	            openOpts.success({
	                bd: bd,
	                root: this.rootEle
	            });
	        }
	        $.pdw.Dialog.prototype.setPlace = function (elem) {
	            elem.css({
	                marginLeft: -Math.floor(elem.width() / 2),
	                marginTop: -Math.floor(elem.height() / 2) + Math.max($(document.documentElement).scrollTop(), $(document.body).scrollTop())
	            });
	        }
	        $.pdw.Dialog.prototype.close = function () {
	            this.inst = false;
	            this.overlay.hide();
	            this.rootEle.hide();
	        }
	
	        $.pdw.dialog = new $.pdw.Dialog();
	
	        $(window).on('scroll', function () {
	            if ($.pdw.dialog.inst)
	                $.pdw.dialog.setPlace($.pdw.dialog.rootEle);
	        });
    	})(jQuery);
    }
});


define("jquery-plugin/pwz-plugin/1.0.1/pwz-plugin-debug", ["./lazyload/1.0.0/lazyload-debug", "./backtop/1.0.0/backtop-debug", "./dialog/1.0.0/dialog-debug", "jquery-debug", "contentShown-debug"], function (require, exports) {
    var $ = require('jquery-debug');
    require('contentShown-debug')($);
    require('./lazyload/1.0.0/lazyload-debug')($);
    require('./backtop/1.0.0/backtop-debug')($);
    require('./dialog/1.0.0/dialog-debug')($);
    //require('./cookie/1.2.0/cookie-debug')($);
    //require('./indexSlide/1.0.0/indexSlide-debug')($);
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
