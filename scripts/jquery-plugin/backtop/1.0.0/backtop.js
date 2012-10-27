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
define(function () {
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