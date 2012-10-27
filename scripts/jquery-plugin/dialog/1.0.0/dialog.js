define(function (require) {
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
