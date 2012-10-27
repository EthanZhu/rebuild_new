define(function () {
    return function (jQuery) {
        /******************************************
        * pdw.slidedown.js
        *
        * @author          my.liu（mingyu）
        * @version         Version 1.0
        * @copyright       Copyright (c) 2012 liu.my
        * 
        * @email			liu.my@paidui.cn
        * use $.pdw.slidedown();
        ******************************************/
        (function ($) {
            $.pdw = $.pdw || {};
            $.pdw.slidedown = function (o) {
                var configs = {
                    imgSrc: '',
                    links: '',
                    target: '',
                    closeSrc: '/Images/Pics/lottery_toll/lottery-lufei-close.gif'
                };
                o = $.extend(configs, o);
                var isShown,
                    indexPopImg,
                    indexPopTimeout,
                    indexHeadSlide,
                    indexPopClose,
                    autoCloseIndexPop;

                if (!o.target || o.target === '') {
                    o.target = "_blank";
                }
                if (o.imgSrc == '') {
                    return;
                } else {
                    var isShown = $.cookie('indexPopShown');
                    if (isShown !== 'hasShown') {
                        indexPopImg = $('<img src="' + o.imgSrc + '">');
                        indexHeadSlide = $('<div class="index_head_popup" style="margin:0 auto; width:960px; position:relative; display:none;" ><a href="' + o.links +
                                               '" target="' + o.target + '"></a><div class="index_head_close" style="position:absolute; top:0; right:0; cursor:pointer;width:23px; height:23px; overflow:hidden; z-index:100; display:none;"><img src="' + o.closeSrc + '" width="21" height="21" /></div></div>');

                        indexPopImg.load(function () {
                            indexPopImg.css({ 'position': 'absoulte', 'z-index': '10' });

                            indexPopImg.appendTo(indexHeadSlide.find('a'));
                            indexPopClose = $('.index_head_close', indexHeadSlide);
                            autoCloseIndexPop = function () {
                                indexPopTimeout = setTimeout(function () { indexPopClose.trigger('click') }, 3500);
                            };
                            autoCloseIndexPop();
                            indexHeadSlide.insertBefore($('#header'));
                            indexHeadSlide.stop(true, true).slideDown(1000, function () {
                                indexPopClose.off().click(function () {
                                    indexHeadSlide.stop(true, true).slideUp(1000, function () {
                                        $(this).remove();
                                    });
                                });
                                indexPopClose.stop(true, true).fadeIn(500);
                            });
                            /*.hover(function () {
                            if (qixiTimeout) {
                            clearTimeout(qixiTimeout);
                            }
                            }, function () {
                            autoCloseQixi();
                            })*/
                        });
                        var date = new Date();
                        date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
                        $.cookie('indexPopShown', 'hasShown', { expires: date, path: '/', domain: PDW.host });
                    }
                }
            }
        })(jQuery);
    }
});