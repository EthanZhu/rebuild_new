/******************************************
* jq.contentShown.js 图片轮显组件
* @author          Ethan.Zhu（zhuyidong）
* @version         Version 2.0
*
******************************************/
define("#contentShown/2.0.0/contentShown-debug", [], function () {
    return function (jQuery) {
        (function ($, undefined) {
            var PROP_NAME = 'contentShown';

            function ContentShown() {
                this.debug = false;
                this.blank = '/web/images/blank.gif';
                this.func = function () { };
                this.classes = [];
                this.classes[''] = {
                    _nav: 'cs-nav',
                    _tlist: 'cs-nav-list',
                    _items: 'cs-nav-items',
                    _item: 'cs-nav-item',
                    _btn: 'cs-nav-btn',
                    _btnPrev: 'cs-nav-prev',
                    _btnNext: 'cs-nav-next',
                    _playBtn: 'cs-play-btn',
                    _playPrev: 'cs-play-prev',
                    _playNext: 'cs-play-next',
                    _active: 'cs-nav-active',
                    _hover: 'cs-nav-hover',
                    _aside: 'cs-nav-aside',
                    _scroll: 'cs-nav-scroll',
                    _sover: 'cs-scroll-over',
                    _tover: 'cs-nav-over',
                    _player: 'cs-player',
                    _message: 'cs-tips-message',
                    _tbackground: 'cs-tips-background',
                    _tinfo: 'cs-tips-info',
                    _pitem: 'cs-player-item',
                    _plist: 'cs-player-list',
                    _otitle: 'cs-tips-ot',
                    _tbtn: 'cs-tips-btn',
                    _ptype: 'cs-player-type',
                    _addtional: 'cs-nav-addtional'
                };
                this._defaults = {
                    id: null, 			// used to getter you needn't to set this.
                    navSpace: 20, 		// navigation item space
                    pWidth: 0, 			// payer main width
                    pHeight: 0, 		// player main height
                    navNum: 4, 			// the quantities of in navigation will be seen 
                    navPlace: null, 	// where is the nav lr: left or right; other: bottom or top 
                    autoPlay: true, 	// auto play: true or false.
                    autoTime: 4000, 	// time interval of AutoPlay
                    events: 'mouseenter', // nav item events
                    tbgAnimate: false, 	// nav background animate
                    tbgSpeed: 'fast', 	// nav background animate speed
                    addtional: false, 	// if you want to show particular style, you can set this as true.
                    step: 1, 			// The quantities of navigation each slide
                    navSpeed: 'fast', 	// nav slide speed
                    navTitle: false,
                    opacity: 0.6,
                    navOpacity: 1,
                    data: null, 		// main data
                    loop: true, 		// nav loop
                    player: true, 		// is show player
                    animate: 'fade', 	// left,right,top,bottom,fade,none
                    showTips: false, 	// show tips message
                    tipsAnimate: 'fade', // fade,slide
                    selected: 1, 		// current selected
                    callback: null,
                    preLoad: true, 		// preload img
                    target: '_blank', 	// global target
                    pSpeed: 500, 		// player animate speed
                    pType: false, 		// plyer type
                    nContent: 'image', 	// type of nav: num,none,image,content
                    pContent: 'image', 	// type of player : image, content
                    listPlace: null, 	// when you want to set up navigation center, set this as center
                    tipsBtn: false, 	// show button in tips
                    loadClass: 'cs-player-loading', // preload class
                    missing: 'cs-load-missing', 	// missing image class
                    //playNav : false,
                    playBtn: true, 	// show button in player you can click to show next or prev one by one
                    playBtnShow: null  	// player button show always or not.  option value: always and others
                };
                $.extend(this._defaults, this.classes['']);
            }
            $.extend(ContentShown.prototype, {
                marker: 'hasContentShown',
                log: function () {
                    if (this.debug)
                        console.log.apply('', arguments);
                },
                setDefaults: function (settings) {
                    extendRemove(this._defaults, settings || {});
                    return this;
                },
                _initContentShown: function (elem, settings) {
                    var self = this,
				id = elem.id,
				$elem = $(elem),
				inline = null,
				name,
				val
                    for (name in self._defaults) {
                        val = elem.getAttribute('date:' + name);
                        if (val) {
                            inline = inline || {};
                            try {
                                inline[name] = eval(val);
                            } catch (err) {
                                inline[name] = val;
                            }
                        }
                    }
                    if (!id) {
                        self.uuid += 1;
                        elem.id = 'cs' + self.uuid;
                    }
                    self._defaults.id = elem.id;
                    var inst = self._newInst($(elem));
                    inst.settings = $.extend({}, settings || {}, inline || {});

                    if ($elem.hasClass(self.marker)) return;
                    $elem.addClass(self.marker);
                    $.data(elem, PROP_NAME, inst);
                    self._instData(inst);

                },
                _instData: function (inst) {
                    var self = this, userData = self._g(inst, 'data'), instData = inst.data, userLength, instLength, thisData, i;
                    if (userData && typeof userData != 'undefined') {
                        userLength = userData.length;
                        if (!instData) {
                            inst.data = [];
                            for (i = 0; i < userLength; i++) {
                                thisData = userData[i];
                                !$.isEmptyObject(thisData) ? inst.data.push(thisData) : self.func;
                            }
                        }
                        else {
                            instLength = instData.length;
                            for (var i = 0; i < userLength; i++) {
                                thisData = userData[i];
                                if (!$.isEmptyObject(thisData)) {
                                    if (i < instLength) inst.data[i] = thisData;
                                    else inst.data.push(thisData);
                                }
                            }
                        }
                    }

                    //alert($.isArray(inst.data));
                    // alert($.isEmptyObject(inst.data));
                    if (typeof (inst.data) == 'object' && $.isArray(inst.data)) {//data is not null and data is an array
                        inst.total = inst.data.length;
                        self._initOption(inst);
                        self._initHtml(inst);
                        self._initEvents(inst);
                    }
                },
                _initOption: function (inst) {
                    var self = this, navNum = self._g(inst, 'navNum'), total = inst.total, step = self._g(inst, 'step'), func = self.func, selected, selectData, player, btnClass, i;
                    inst.loaded = [];
                    inst.images = [];
                    step = step >= total ? 1 : (step >= navNum ? parseInt(navNum / 2) : self._g(inst, 'step'));
                    navNum == total ? extendRemove(inst.settings, { 'loop': false }) : func;
                    extendRemove(inst.settings, { 'step': step });
                    selected = self._g(inst, 'selected');
                    selected > inst.total ? (inst.selected = 0, selected = 1) : inst.selected = selected - 1;
                    if (inst.selected > 0) {
                        selectData = inst.data[selected];
                        for (i = selected; i > 0; i--) inst.data[i] = inst.data[i - 1];
                        inst.data[0] = selectData;
                        inst.selected = 0;
                    }
                    player = self._g(inst, 'player');
                    inst.firstPlay = false;
                    inst.$playBtns = inst.$player = '';
                    if (player) {
                        var $playUl, loadClass, playBtn, display;
                        inst.$player = $('<div class="' + self._g(inst, '_player') + '" />');
                        loadClass = self._g(inst, 'loadClass');
                        if (self._g(inst, 'preLoad')) if (!inst.$player.hasClass(loadClass)) inst.$player.addClass(loadClass);
                        else if (inst.$player.hasClass(loadClass)) inst.$player.removeClass(loadClass);
                        $playUl = $('<ul class="' + self._g(inst, '_plist') + '" />');
                        $playUl.appendTo(inst.$player);
                        $playUl = null;
                        if (self._g(inst, 'playBtn')) {
                            playBtn = self._g(inst, '_playBtn');
                            display = self._g(inst, 'playBtnShow') != 'always' ? ' style="display:none;"' : ''
                            inst.$playBtns = $('<div class="' + playBtn + ' ' + self._g(inst, '_playPrev') + '"' + display + '></div><div class="' + playBtn + ' ' + self._g(inst, '_playNext') + '"' + display + '></div>')
                        }
                    }

                    inst.$nav = $('<div class="' + self._g(inst, '_nav') + '" />');
                    btnClass = self._g(inst, '_btn');
                    inst.$btnPrev = $('<div class="' + btnClass + '"><span class="' + self._g(inst, '_btnPrev') + '" />');
                    inst.$btnNext = $('<div class="' + btnClass + ' ' + self._g(inst, '_aside') + '"><span class="' + self._g(inst, '_btnNext') + '" />');
                    inst.$navList = $('<div class="' + self._g(inst, '_tlist') + '" />');
                    if (self._g(inst, 'showTips')) {
                        inst.$tipsBg = $('<div class="' + self._g(inst, '_tbackground') + '" />').css('opacity', self._g(inst, 'opacity'));
                        inst.$tipsInfo = $('<div class="' + self._g(inst, '_tinfo') + '" />');
                    }
                    else {
                        inst.selfipsBg = '';
                        inst.selfipsInfo = '';
                    }
                    if (typeof navNum === 'string') {
                        extendRemove(inst.settings, { 'loop': false, 'tbgAnimate': false, 'navPlace': null });
                        inst.$btnPrev = inst.$btnNext = '';
                    }
                    self._g(inst, 'tbgAnimate') ? (
						inst.$scroll = $('<div class="' + self._g(inst, '_scroll') + '"><a href="#" target="' + self._g(inst, 'target') + '">&nbsp;</a></div'),
						inst.navOver = self._g(inst, '_sover')
					) : (
						inst.$scroll = '', inst.navOver = self._g(inst, '_tover')
					);
                },
                _getAttribute: function (items, link_, target_, width_, height_) {
                    var link, src, target, alt, width, height, item;
                    width = width_ || '', height = height_ || '',
			target = target_,
			!link_ || link_ === '' ? (link = 'none', target = '_self') : link = link_;

                    if (typeof items == 'string') {
                        src = items;
                        alt = '';
                    }
                    else {
                        item = $.isArray(items) ? items[0] : items;
                        !$.isEmptyObject(item) ? (
						link = item.l ? item.l : link,
						src = item.t ? item.t : '',
						target = item.g ? item.g : target,
						alt = item.a ? item.a : '',
						width = item.w ? item.w : width,
						height = item.h ? item.h : height
					) : (
						src = null, alt = null
					);
                    }
                    if (src) return { t: src, l: link, g: target, a: alt, w: width, h: height };
                },
                _initHtml: function (inst) {
                    var self = this, data = inst.data;
                    inst.$elem.html('');
                    var i,
				navList,
				glink,
				playItem,
				itemData,
				target = self._g(inst, 'target'),
				total = inst.total,
				width = self._g(inst, 'pWidth'),
				height = self._g(inst, 'pHeight'),
				navNum = self._g(inst, 'navNum'),
				pContent = self._g(inst, 'pContent'),
				nContent = self._g(inst, 'nContent'),
				preLoad = self._g(inst, 'preLoad'),
				navClass = self._g(inst, '_item'),
				playClass = self._g(inst, '_pitem'),
				player = self._g(inst, 'player'),
				blank = self.blank,
				func = self.func,
                    // $itemList = $('<ul class="'+self._g(inst,'_items')+' '+self._g(inst,'_clear')+'" />');
				$itemList = $('<ul class="' + self._g(inst, '_items') + '" />');

                    var getItem = function (items, link, where, index) {
                        var attr, img, img_ = null, $item, style;
                        where == 'play' ? (img = self._getAttribute(items.b, link, target, width, height), style = playClass)
							   : (img = self._getAttribute(items.s, link, target), style = navClass);
                        typeof img != 'undefined' ? (
					img.w && img.h && img.w != '' && img.h != '' ? (img_ = preLoad ? ('<img data-origital="' + img.t + '" src="' + blank + '" width="' + img.w + '" height="' + img.h + '" alt="' + img.a + '">') :
																			   ('<img src="' + img.t + '" width="' + img.w + '" height="' + img.h + '" alt="' + img.a + '">')) :
															 (img_ = preLoad ? ('<img data-origital="' + img.t + '" src="' + blank + '" alt="' + img.a + '">') : ('<img src="' + img.t + '" alt="' + img.a + '">')),
                        //					(
                        //						where == 'play' ? $item = $(['<li class="' + style + '"><a href="' + img.l + '" target="' + img.g + '">' + img_ + '</a></li>'].join("")) :
                        //									(self._g(inst, 'navTitle') ? $item = $(['<li class="' + style + '"><a href="' + img.l + '" target="' + img.g + '">' + img_ + '<span>' + items.t + '</span></a></li>'].join("")) :
                        //															$item = $(['<li class="' + style + '"><a href="' + img.l + '" target="' + img.g + '">' + img_ + '</a></li>'].join("")))
                        //					)
                    (
						where == 'play' ? (
                            $item = img.l === 'none' ? $(['<li class="' + style + '">' + img_ + '</li>'].join("")) : $(['<li class="' + style + '"><a href="' + img.l + '" target="' + img.g + '">' + img_ + '</a></li>'].join(""))
                        ) : (
                            (self._g(inst, 'navTitle') ? $item = $(['<li class="' + style + '"><a href="' + img.l + '" target="' + img.g + '">' + img_ + '<span>' + items.t + '</span></a></li>'].join("")) :
															$item = $(['<li class="' + style + '"><a href="' + img.l + '" target="' + img.g + '">' + img_ + '</a></li>'].join("")))
                        )
					)

				) : (
					$item = $(['<li class="' + style + '">Missing data.</li>'].join(""))
				);

                        where == 'play' ? $item.css({ 'z-index': total - index, opacity: 0 }) : func;
                        if (!preLoad) {
                            $(img_).load(function () {
                                //$item.attr('data-missing', 'false');
                                $item.find('img').unbind();
                            }).error(function () {
                                $item.attr('data-missing', 'true');
                                $item.find('img').addClass(self._g(inst, 'missing')).attr('src', blank).unbind();
                            });
                        }
                        return $item;
                    },
			getContent = function (content, link, where) {
			    var $content = null, $href, style = where === 'nav' ? navClass : playClass;
			    if (typeof content == 'string') {
			        $content = $('<div>' + content + '</div>');
			        $href = $content.find('a');
			        typeof $href[0] != 'undefined' ? ($href.attr('target', target), $content = $(['<li class="' + style + '">' + content + '</li>'].join("")))
						: typeof link != 'undefined' ? $content = $(['<li class="' + style + '"><a href="' + link + '" target="' + target + '">' + content + '</a></li>'].join(""))
						: $content = $(['<li class="' + style + '">' + content + '</li>'].join(""));
			    }
			    else if (typeof content == 'object') {
			        if (!$.isEmptyObject(content)) {
			            var link_ = content.l ? content.l : link, target_ = content.g ? content.g : target, content_ = content.p;
			            $content = $('<div>' + content_ + '</div>');
			            $href = $content.find('a');
			            $content = typeof $href[0] != 'undefined' ? ($href.attr('target', target_), $(['<li class="' + style + '">' + content_ + '</li>'].join("")))
										: $(['<li class="' + style + '"><a href="' + link_ + '" target="' + target_ + '">' + content_ + '</a></li>'].join(""));
			        }
			    }
			    return $content;
			},
			setNavItem = function (items, type) {
			    for (i = 0; i < total; i++) {
			        itemData = items[i], glink = itemData.l; //global link
			        if (!$.isEmptyObject(itemData)) {
			            switch (type) {
			                case 'image': navList = getItem(itemData, glink); break;
			                case 'num': navList = $(['<li class="' + navClass + '"><span>' + (i + 1) + '</span></li>'].join("")); break;
			                case 'content': navList = getContent(itemData.s, glink, 'nav'); break;
			                default: navList = $(['<li class="' + navClass + '"><span>&nbsp;</span></li>'].join(""));
			            }
			            navList.attr('data-index', i);
			            navList.appendTo($itemList);
			        }
			    }
			};
                    if (player) {
                        width = width ? width : '';
                        height = height ? height : '';
                        inst.$player.css({ 'width': width, 'height': height });
                        for (i = 0; i < total; i++) {
                            itemData = data[i], glink = itemData.l;
                            if (!$.isEmptyObject(itemData)) {
                                playItem = pContent == 'content' ? getContent(itemData.b, glink) : getItem(itemData, glink, 'play', i);
                                playItem.css({ 'width': width, 'height': height })
                                inst.images.push(playItem);
                                !preLoad ? inst.loaded.push(playItem) : '';
                                inst.$player.find('ul.' + self._g(inst, '_plist')).append(playItem);
                                playItem = null;
                            }
                        }
                    }
                    setNavItem(data, nContent);
                    $itemList.appendTo(inst.$navList);

                    if (typeof navNum == 'number') {
                        if (self._g(inst, 'tbgAnimate')) {
                            self._g(inst, 'events') == 'click' ? inst.$scroll.find('a').remove() : '';
                            inst.$scroll.appendTo(inst.$navList);
                        };
                        if (total <= navNum) inst.$btnPrev = inst.$btnNext = '';
                    }
                    if (self._g(inst, 'showTips')) inst.$tipsInfo.append($('<div class="' + self._g(inst, '_message') + '" />'));
                    inst.$nav.append(inst.$btnPrev, inst.$navList, inst.$btnNext);

                    if (self._g(inst, 'ptype')) inst.$playType = $('<div class="' + self._g(inst, '_ptype') + '" />');
                    inst.$elem.append(inst.$player, inst.$nav, inst.$tipsBg, inst.$playType, inst.$tipsInfo, inst.$playBtns);

                    if (player) {
                        var animate = self._g(inst, 'animate'), $player = inst.$player.find('li.' + playClass);
                        switch (animate) {
                            case 'left': $player.css({ 'left': width, 'opacity': 1 }); break;
                            case 'right': $player.css({ 'left': 0 - width, 'opacity': 1 }); break;
                            case 'top': $player.css({ 'top': 0 - height, 'opacity': 1 }); break;
                            case 'bottom': $player.css({ 'top': height, 'opacity': 1 }); break;
                        }
                        $player = null;
                    }
                    var place = self._g(inst, 'navPlace'), $first, totalHeight, totalWidth, navSpace = self._g(inst, 'navSpace'), distance = navSpace * navNum;

                    if (typeof navNum == 'number') {
                        $first = inst.$navList.find('li:first');
                        if (place == 'lr') {
                            width = $first.outerWidth(true), height = distance, totalWidth = width, totalHeight = total * navSpace;
                        }
                        else {
                            width = distance, height = $first.outerHeight(true);
                            //                    if (self._g(inst, 'navTitle')) {
                            //                        //height += $first.find('span').height();
                            //                    }
                            totalWidth = total * navSpace, totalHeight = height;
                        }
                        inst.$navList.css({ 'width': width, 'height': height });
                        if (self._g(inst, 'listPlace') == 'center') {
                            place == 'lr' ? inst.$navList.css({ 'top': '50%', 'margin-top': 0 - parseInt(height / 2) }) : inst.$navList.css({ 'left': '50%', 'margin-left': 0 - parseInt(width / 2) });
                        }
                        $itemList.css({ 'width': totalWidth, 'height': totalHeight, 'position': 'absolute', 'top': 0, 'left': 0 });
                    }
                    inst.$navList = $itemList;
                    $itemList = null;
                    var $listItem, $this, $itemImages;
                    $listItem = inst.$navList.find('li');
                    if (navNum == 'css' && self._g(inst, 'addtional')) {
                        inst.$addtional = $('<div class="' + self._g(inst, '_addtional') + '" />');
                        $listItem.each(function () {
                            $this = $(this);
                            $this.height($this.find('img').height());
                            $this.width($this.find('img').width());
                        });
                        inst.$nav.append(inst.$addtional.append(inst.$navList.clone()));
                    }

                    preLoad ? $listItem.each(function (index) {
                        $itemImages = $(this).find('img'), img = $itemImages[0];
                        typeof img != 'undefined' ? img.src = $itemImages.attr('data-origital') : func;
                    }) : func;
                    place = place == 'lr' ? 'top' : 'left';
                    self._g(inst, 'loop') ? ($listItem.each(function (index) { $(this).css(place, index * navSpace).css('position', 'absolute'); if (index == total - 1) $itemList = null; })) : func;
                    self._extendNav(inst);
                },
                _extendNav: function (inst) { return; },
                _initEvents: function (inst) {
                    var self = this;
                    self._element(inst);
                    self._mobile(inst);
                    self._navBtns(inst);
                    self._navItem(inst);
                    self._playBtns(inst);
                    self._selected(inst);
                    self._end(inst);
                },
                _end: function (inst) {
                    for (var name in inst) {
                        inst[name] === '' ? inst[name] = null : this.func;
                    }
                    var support = $.support;
                    if (!support.opacity && !support.style && !support.tbody) {
                        CollectGarbage();
                    }
                },
                _mobile: function (inst) { },
                _element: function (inst) {
                    var self = this, auto = self._g(inst, 'autoPlay'), loop = self._g(inst, 'loop'), func = self.func, $playBtns, playBtnShow = self._g(inst, 'playBtnShow');

                    $playBtns = inst.$playBtns;
                    inst.$elem.mouseenter(function () {
                        inst.hoverPause = true;
                        !loop ? inst.cSelected = inst.selected : func;
                        auto ? self.stop(inst.id) : func;
                        $playBtns && $playBtns != '' && playBtnShow != 'always' ? $playBtns.fadeIn() : func;
                    }).mouseleave(function () {
                        inst.hoverPause = false;
                        self.startAt(inst.id);
                        $playBtns && $playBtns != '' && playBtnShow != 'always' ? $playBtns.fadeOut() : func;
                    }).delegate('a', 'focus', function () {
                        if (this.blur) this.blur();
                    });
                    //  inst.$elem = null;
                },
                _navItem: function (inst) {
                    var self = this,
				tag = self._g(inst, 'navNum'),
				addtional = self._g(inst, 'addtional'),
				item = self._g(inst, '_item'),
				$list = inst.$navList,
				$items = $list.find('li.' + item),
				events = self._g(inst, 'events');

                    if (tag == 'css' && addtional) $list = inst.$addtional.find('ul');
                    $list.delegate('li.' + item, events, function (e) {
                        var $this = $(this), index = $this.attr('data-index');
                        if (events == 'click') e.preventDefault();
                        if (index != inst.selected) {
                            !addtional ? self._selected(inst, $this) : self._selected(inst, $items.eq(index));
                        }
                    });
                    $list = null;
                },
                _navBtns: function (inst) {
                    var self = this, btn;
                    var prevClick = function () {
                        btn = inst.$btnPrev;
                        if (!btn || btn == '') return;
                        btn.unbind().bind('click', function () {
                            if (inst.btnClick) self._scrollByStep(inst, 'prev', true);
                        });
                    },
				nextClick = function () {
				    btn = inst.$btnNext;
				    if (!btn || btn == '') return;
				    btn.unbind().bind('click', function () {
				        if (inst.btnClick) self._scrollByStep(inst, 'next');
				    });
				},
				btnsHover = function () {
				    var $arrows = inst.$nav.find('.' + self._g(inst, '_btn')), active = self._g(inst, '_active'), hover = self._g(inst, '_hover'), aside = self._g(inst, '_aside');
				    if ($arrows) $arrows.addClass(active);
				    if (!self._g(inst, 'loop')) {
				        if ((inst.selected + 1) <= self._g(inst, 'navNum'))
				            $arrows.each(function () { var $this = $(this); $this.hasClass(aside) ? $this.addClass(active) : $this.removeClass(active); });
				    }
				    $arrows.hover(function () {
				        var $this = $(this); if ($this.hasClass(active)) $this.addClass(hover);
				    }, function () {
				        var $this = $(this); if ($this.hasClass(active) && $this.hasClass(hover)) $this.removeClass(hover);
				    });
				};

                    nextClick();
                    prevClick();
                    btnsHover();
                    inst.$nav = null;
                },

                _selected: function (inst, obj) {
                    var self = this,
				speed = self._g(inst, 'tbgSpeed'),
				overClass = inst.navOver,
				place = self._g(inst, 'navPlace'),
				bgAnimate = self._g(inst, 'tbgAnimate'),
				nContent = self._g(inst, 'nContent'),
				$list = inst.$navList,
				loop = self._g(inst, 'loop'),
				fun = self.func,
				dataIndex,
				$scroll,
				objPlace,
				listPlace,
				overPlace;
                    inst.btnClick = false;
                    if (!inst.firstPlay) inst.firstPlay = true;
                    !obj ? (loop ? obj = $list.find('li').eq(0) : obj = $list.find('li').eq(inst.selected)) : fun;
                    dataIndex = obj.attr('data-index');
                    inst.firstPlay ? (inst.selected = -1, inst.firstPlay = false) : fun;
                    inst.selected = inst.cSelected = parseInt(dataIndex);
                    inst.selected_ = obj.index();

                    if (nContent == 'image') {
                        var $img = obj.find('img'), opacity = self._g(inst, 'navOpacity');
                        typeof $img[0] != 'undefined' ? $img.stop().animate({ 'opacity': 1 }, 'fast') : fun;
                        obj.siblings().each(function () {
                            var $this = $(this), thisImg = $this.find('img');
                            typeof (thisImg[0]) != 'undefined' ? thisImg.stop().animate({ opacity: opacity }, 'fast') : fun;
                        });
                    }
                    objPlace = obj.position();

                    place === 'lr' ? (
				objPlace = parseInt(objPlace.top),
				listPlace = parseInt($list.css('top'))
			) : (
				objPlace = parseInt(objPlace.left),
				listPlace = parseInt($list.css('left'))
			);
                    overPlace = objPlace - Math.abs(listPlace);

                    var space = self._g(inst, 'navSpace'), navNum = self._g(inst, 'navNum'), navSpace = space * (navNum - 1);

                    var checkNav = function () {
                        inst.btnClick = true;
                        if (overPlace > navSpace) {
                            self._scrollByStep(inst, 'next');
                        }
                        if (overPlace < 0) {
                            if (!loop) {
                                inst.selected == 0 ? self._resetNav(inst) : self._scrollByStep(inst, 'prev');
                            }
                        }
                    };

                    self._display(inst);
                    if (bgAnimate) {
                        $scroll = inst.$scroll;
                        $scrollLink = $scroll.find('a');
                        scrollLink = $scrollLink[0];
                        $objLink = obj.find('a:first');
                        objLink = $objLink[0];
                        place == 'lr' ? $scroll.stop(true, true).animate({ top: overPlace }, speed, checkNav) : $scroll.stop(true, true).animate({ left: overPlace }, speed, checkNav);
                    }
                    else {
                        checkNav();
                    }
                    self._extendStyle(inst);
                    obj.addClass(overClass).siblings().removeClass(overClass);

                },
                _extendStyle: function (inst) { return; },
                _scrollByStep: function (inst, which, isClick) {
                    var self = this;
                    var total = inst.total;
                    var navNum = self._g(inst, 'navNum');
                    var space = self._g(inst, 'navSpace');
                    var step = self._g(inst, 'step');
                    var speed = self._g(inst, 'navSpeed');
                    var $list = inst.$navList;
                    var place = self._g(inst, 'navPlace');
                    var loop = self._g(inst, 'loop');
                    var func = self.func;
                    var tbgAnimate = self._g(inst, 'tbgAnimate');
                    var tbgSpeed = self._g(inst, 'tbgSpeed');
                    var stepPlace = space * step;
                    var totalPlace = (total - navNum) * space;
                    var nowPlace,
				newPlace,
				tbgPlace,
				overPlace = 0,
				$scroll = inst.$scroll,
				position = place === 'lr' ? 'top' : 'left',
				whichBtn = which === 'prev' ? 'next' : 'prev';
                    if (!loop) {
                        self._enabledBtn(inst, whichBtn);
                        nowPlace = parseInt($list.css(position));
                        if (which === 'next') {
                            if (Math.abs(nowPlace) === totalPlace) return;
                            inst.btnClick = false;
                            newPlace = Math.abs(nowPlace) + stepPlace;
                            newPlace > totalPlace ? (overPlace = newPlace - totalPlace, newPlace = totalPlace) : func;
                            newPlace = 0 - newPlace;
                            stepPlace = 0 - stepPlace;
                        }
                        else if (which === 'prev') {
                            if (Math.abs(nowPlace) === 0) return;
                            inst.btnClick = false;
                            newPlace = nowPlace + stepPlace;
                            newPlace > 0 ? (overPlace = 0 - newPlace, newPlace = 0) : func;
                            totalPlace = 0;
                        }
                        self._scrollNav(inst, newPlace, function () {
                            Math.abs(parseInt($list.css(position))) === totalPlace ? self._disabledBtn(inst, which) : func;
                            !tbgAnimate ? inst.btnClick = true : func;
                            //inst.btnClick = true;
                        });
                        if (tbgAnimate) {
                            tbgPlace = parseInt($scroll.css(position)) + stepPlace
                            place === 'lr' ? ($scroll.animate({ top: tbgPlace + overPlace }, tbgSpeed, function () { inst.btnClick = true; }))
								   : ($scroll.animate({ left: tbgPlace + overPlace }, tbgSpeed, function () { inst.btnClick = true; }));
                        }
                    }
                    else {
                        inst.btnClick = false;
                        var $this, thisPlace, $selected, item = self._g(inst, '_item'), scrollPlace, selectedPlace, lists, setNavItem;
                        totalPlace = total * space;
                        if (which === 'next') {
                            setNavItem = function () {
                                lists = $list.find('li.' + item);

                                lists.each(function (index) {
                                    $(this).css(position, (index - step) * space);
                                });
                                $list.css(position, 0);
                                $list = null
                                lists.slice(0, step).detach().insertAfter(lists.last()).each(function (index) {
                                    $this = $(this);
                                    $this.css(position, totalPlace + parseInt($this.css(position)));
                                    if (index == step - 1) {
                                        $selected = self._indexAt(inst);
                                        inst.selected_ = $selected.index();
                                        if (tbgAnimate) {
                                            selectedPlace = parseInt(self._indexAt(inst).css(position));
                                            scrollPlace = parseInt(inst.$scroll.stop(true, true).css(position));
                                            if (scrollPlace != selectedPlace) $scroll.css(position, selectedPlace);
                                        }
                                        inst.btnClick = true;
                                    }
                                    $this = null;
                                });
                                lists = null;

                            };
                            place === 'lr' ? (
						tbgAnimate ? (scrollPlace = parseInt($scroll.css(position)) - stepPlace, $scroll.animate({ top: scrollPlace }, tbgSpeed)) : func,
						$list.animate({ top: 0 - stepPlace }, speed, setNavItem)
					) : (
						tbgAnimate ? (scrollPlace = parseInt($scroll.css(position)) - stepPlace, $scroll.animate({ left: scrollPlace }, tbgSpeed)) : func,
						$list.animate({ left: 0 - stepPlace }, speed, setNavItem)
					);
                        }
                        else {//prev
                            lists = $list.find('li.' + item);
                            lists.each(function (index) {
                                $this = $(this);
                                $this.css(position, (index + step) * space)
                            });
                            $list.css(position, 0 - stepPlace);
                            lists.slice(total - step).detach().insertBefore(lists.slice(0, 1)).each(function () {
                                $this = $(this);
                                $this.css(position, parseInt($this.css(position)) - totalPlace);
                            });
                            setNavItem = function () {
                                $selected = self._indexAt(inst);
                                inst.selected_ = $selected.index();
                                if (tbgAnimate) {
                                    selectedPlace = parseInt(self._indexAt(inst).css(position));
                                    scrollPlace = parseInt(inst.$scroll.stop(true, true).css(position));
                                    if (scrollPlace != selectedPlace) $scroll.css(position, selectedPlace);
                                    $list = null;
                                }
                                inst.btnClick = true;
                            };
                            if (place === 'lr') {
                                tbgAnimate ? (scrollPlace = parseInt($scroll.css(position)) + stepPlace, $scroll.animate({ top: scrollPlace }, tbgSpeed)) : func
                                $list.animate({ top: 0 }, speed, setNavItem)
                            }
                            else {
                                tbgAnimate ? (scrollPlace = parseInt($scroll.css(position)) + stepPlace, $scroll.animate({ left: scrollPlace }, tbgSpeed)) : func
                                $list.animate({ left: 0 }, speed, setNavItem)
                            }
                        }
                    }
                },

                _playBtns: function (inst) {
                    var $selected,
				self = this,
				$playBtns = inst.$playBtns,
				selected,
				$obj,
				$list = inst.$navList.find('li'),
				loop = self._g(inst, 'loop'),
				total = inst.total;
                    if ($playBtns && $playBtns != '') {
                        $playBtns.mouseenter(function () {
                            self.startAt(inst.id);
                        }).click(function () {
                            selected = loop ? inst.selected_ : inst.selected
                            if (inst.btnClick) {
                                if ($(this).hasClass(self._g(inst, '_playNext'))) {
                                    if (loop) $list = inst.$navList.find('li');
                                    else if (selected == total - 1) return;
                                    selected = parseInt(selected) + 1;
                                    $obj = $list.eq(selected);
                                    self._selected(inst, $obj);
                                }
                                else {
                                    if (loop) {
                                        selected == 0 ? self._scrollByStep(inst, 'prev') : self.func;
                                        $list = inst.$navList.find('li');
                                        selected = self._indexAt(inst).index();
                                    }
                                    else if (selected == 0) return;
                                    selected = parseInt(selected) - 1;
                                    $obj = $list.eq(selected);
                                    self._selected(inst, $obj);
                                }
                            }
                        })
                    }
                },
                _scrollNav: function (inst, distance, fun) {
                    var $list = inst.$navList,
				speed = this._g(inst, 'navSpeed'),
				place = this._g(inst, 'navPlace'),
				func = fun || function () { };
                    place == 'lr' ? $list.animate({ top: distance }, speed, func) : $list.animate({ left: distance }, speed, func);
                },
                _enabledBtn: function (inst, which) {
                    var active = this._g(inst, '_active'), $btn;
                    $btn = which === 'prev' ? inst.$btnPrev : inst.$btnNext;
                    !$btn.hasClass(active) ? $btn.addClass(active) : this.func;
                },
                _disabledBtn: function (inst, which) {
                    var active = this._g(inst, '_active'), hover = this._g(inst, '_hover'), $btn, func = this.func;
                    $btn = which === 'prev' ? inst.$btnPrev : inst.$btnNext;
                    $btn.hasClass(active) ? ($btn.removeClass(active), $btn.hasClass(hover) ? $btn.removeClass(hover) : func) : func;
                },
                stop: function (id) {
                    var inst = this._getInst($('#' + id)[0]);
                    if (inst.timeOutID) clearTimeout(inst.timeOutID);
                },
                startAt: function (id) {
                    var inst = this._getInst($('#' + id)[0]);
                    if (inst.timeOutID) clearTimeout(inst.timeOutID);
                    var self = this,
				$scroll = inst.$scroll,
				loop = self._g(inst, 'loop'),
				space = self._g(inst, 'navSpace'),
				place = self._g(inst, 'navPlace'),
				navNum = self._g(inst, 'navNum'),
				navSpace = (navNum - 1) * space,
				bgAnimate = self._g(inst, 'tbgAnimate'),
				$selected = self._indexAt(inst),
				splace, //selected position
				lplace, // list position
				cplace, //scroll postion
				$list;

                    if (loop) {
                        splace = place == 'lr' ? $selected.css('top') : $selected.css('left');
                        splace = parseInt(splace);
                        if (parseInt(splace) > navSpace) {
                            if (bgAnimate) {
                                splace = place == 'lr' ? parseInt($scroll.css('top')) : parseInt($scroll.css('left'));
                                splace > navSpace ? (place == 'lr' ? $scroll.css('top', 0) : $scroll.css('left', 0)) : self.func;
                            }
                            self._selected(inst);
                        }
                    }
                    else {
                        $list = inst.$navList;
                        splace = $selected.position();
                        lplace = place == 'lr' ? $list.css('top') : $list.css('left');
                        splace = place == 'lr' ? splace.top : splace.left;
                        lplace = Math.abs(parseInt(lplace));
                        splace = Math.abs(parseInt(splace));

                        if (splace < lplace) inst.selected = parseInt(lplace / space);
                        else if ((lplace + navSpace) < splace) {
                            inst.selected = parseInt(lplace / space);
                            if (bgAnimate) {
                                cplace = place == 'lr' ? parseInt($scroll.css('top')) : parseInt($scroll.css('left'));
                                cplace > navSpace ? place == 'lr' ? $scroll.css('top', 0) : $scroll.css('left', 0) : '';
                            }
                        }
                        else inst.cSelected = inst.selected;
                        if (inst.cSelected != inst.selected) self._selected(inst);
                    }
                    self.start(id);
                },
                start: function (id) {
                    var self = this, inst = self._getInst($('#' + id)[0]), func = self.func;
                    inst.timeOutID ? clearTimeout(inst.timeOutID) : func;
                    if (inst.haveLoad && self._g(inst, 'autoPlay')) {
                        inst.timeOutID = null;
                        inst.timeOutID = self._g(inst, 'autoPlay') ? setTimeout(function () { self._auto(inst); }, self._g(inst, 'autoTime')) : func;
                    }
                },
                _auto: function (inst) {
                    var self = this, $obj = null;
                    if (inst.timeOutID && inst.haveLoad) {
                        if (self._g(inst, 'loop')) {
                            inst.selected_ = inst.selected_ >= (inst.total - 1) ? 0 : ++inst.selected_;
                            $obj = inst.$navList.find('li').eq(inst.selected_);
                        }
                        else {
                            inst.selected = inst.selected >= (inst.total - 1) ? 0 : ++inst.selected;
                            // inst.selected = inst.selected <= 0 ? inst.total : --inst.selected;
                            $obj = inst.$navList.find('li').eq(inst.selected);
                        }
                        self._selected(inst, $obj);
                    }
                },

                setCallback: function (id) {
                    var inst = this._getInst($('#' + id)[0]);
                    inst.backOptions = {
                        id: inst.id,
                        total: inst.total,
                        selected: inst.selected,
                        curNav: this._indexAt(inst),
                        curPlay: inst.$curPlay
                    };
                },
                _display: function (inst) {
                    var self = this, id = inst.id, callback = self._g(inst, 'callback'), func = self.func, player = self._g(inst, 'player');
                    self.stop(id);
                    callback ? (self.setCallback(id), callback(inst.backOptions)) : func;
                    if (player) {
                        var $player = inst.$player, animate = self._g(inst, 'animate'), $list = inst.$navList, pContent = self._g(inst, 'pContent'),
					total = inst.total, images = inst.images, dataIndex = inst.selected, $img, curSrc, origital,
					blank = self.blank, $curPlay, $played, preLoad = self._g(inst, 'preLoad'), playIndex, $this; //speed,width = self._g(inst,'pWidth');
                        var getList = function (index) {
                            return images[index];
                        },
					bindSrc = function (obj) {
					    $img = obj.find('img');
					    $img.each(function () {
					        $this = $(this);
					        if (typeof $this[0] != 'undefined') {
					            //console.log($this[0]);
					            curSrc = $this[0].src;
					            origital = $this.attr('data-origital');
					            //					            origital && origital != '' ? (
					            //									curSrc == blank ? $this[0].src = origital : (curSrc != origital ? $this[0].src = origital : func)
					            //								) : func;
					            if (origital && origital != '') {
					                if (curSrc == blank) {
					                    $this[0].src = origital;
					                }
					                else {
					                    if (curSrc != origital) {
					                        try {
					                            $this[0].src = origital;
					                        }
					                        catch (e) {
					                            $this[0].src = blank;
					                        }
					                    }

					                }
					            }
					        }
					    })

					};
                        $curPlay = inst.$curPlay = getList(dataIndex);
                        $played = inst.$played;

                        $curPlay.siblings().find('img').unbind();

                        playIndex = $curPlay.index();
                        var $playImg; //imgSize = typeof $playImg[0] != 'undefined' ? $playImg.size() : 0;
                        inst.haveLoad = false;
                        if (inst.loaded[playIndex]) {
                            inst.haveLoad = true;
                            self.playStart(id);
                        }
                        else {
                            preLoad ? bindSrc($curPlay) : func;
                            $playImg = $curPlay.find('img');
                            var loadFunc = function () {
                                inst.haveLoad = true;
                                self.playStart(id);
                            }
                            if ($played && typeof $played != 'undefiend') $played.css('opacity', '0.3');
                            if (pContent == 'image') {
                                //console.log($playImg);
                                //if (imgSize > 0) {
                                $playImg.load(function () {
                                    $curPlay.attr('data-missing', 'false');
                                    $(this).unbind();
                                    loadFunc();
                                }).error(function () {
                                    isLoadError = true;
                                    $this = $(this)
                                    $this.addClass(self._g(inst, 'missing'));
                                    $this[0].src = self.blank;
                                    $curPlay.attr('data-missing', 'true');
                                    $this.unbind();
                                    loadFunc();
                                });
                                //}
                                //else {
                                //    loadFunc();
                                //}
                            }
                            else if (pContent == 'content') {
                                //if (imgSize > 0) {
                                $playImg.each(function (index) {
                                    $this = $(this);
                                    $this.load(function () {
                                        $curPlay.attr('data-missing', 'false');
                                    }).error(function () {
                                        $this = $(this)
                                        $curPlay.attr('data-missing', 'true');
                                        $this.addClass(self._g(inst, 'missing'));
                                        $this[0].src = self.blank;
                                    });
                                });
                                //}
                                loadFunc();
                            }
                            inst.loaded[playIndex] = $curPlay;
                        }
                    }
                    else {
                        inst.haveLoad = true;
                        if (!inst.hoverPause) self.start(inst.id);
                    }
                },
                _indexAt: function (inst) {
                    var selected = inst.selected;
                    var $list = inst.$navList.find("li"),
				i, j, $find = null, $selected;
                    for (i = 0, j = $list.length; i < j; i++) {
                        $selected = $($list[i]);
                        if (parseInt($selected.attr('data-index')) === selected) {
                            $find = $selected;
                            break;
                        }
                    }
                    return $find;
                },
                _doPlayer: function (inst) {
                    var self = this,
                    // inst = self._getInst($('#'+id)[0]),
				animate = self._g(inst, 'animate'),
				speed = self._g(inst, 'pSpeed'),
				total = inst.total,
				width = self._g(inst, 'pWidth'),
				height = self._g(inst, 'pHeight'),
				$curPlay = inst.$curPlay,
				$played = inst.$played;
                    // if(inst.playPause) inst.playPause = false;
                    // else{
                    if (!inst.playPause && $curPlay) {
                        switch (animate) {
                            case 'fade': self._pf($curPlay, speed, total, function () { inst.$played = $curPlay }); break;
                            case 'left': self._plr($curPlay, width, total, speed, function () { inst.$played = $curPlay; $curPlay.siblings().css('left', width); }, 'left'); break;
                            case 'right': self._plr($curPlay, width, total, speed, function () { inst.$played = $curPlay; $curPlay.siblings().css('left', 0 - width); }); break;
                            case 'bottom': self._pbt($curPlay, height, total, speed, function () { inst.$played = $curPlay; $curPlay.siblings().css('top', height); }, 'bottom'); break;
                            case 'top': self._pbt($curPlay, height, total, speed, function () { inst.$played = $curPlay; $curPlay.siblings().css('top', 0 - height); }); break;
                            default: $curPlay.stop().css({ 'opacity': 1, 'z-index': total }).show().siblings().css({ 'opacity': 0, 'z-index': 0 }).hide()
                        }
                        self._setTipsInfo(inst);
                        if (!inst.hoverPause) self.start(inst.id);
                    }

                },
                _setTipsInfo: function (inst) {
                    var self = this,
				func = self.func;
                    if (self._g(inst, 'showTips')) {
                        var $tipsBg = inst.$tipsBg,
					$tipsInfo = inst.$tipsInfo,
					dataIndex = inst.selected,
					thisInfo = inst.data[dataIndex],
					link = thisInfo.l,
					target = self._g(inst, 'target'),
					playType = self._g(inst, 'ptype'),
					typeClass = self._g(inst, '_ptype'),
					message, tipsBtn, otherTitle, type, style, length, i, j, thisLink, thisTarget, thisTitle, thisText, thisBtns, content, thisLength, thisCont = '', otherList;

                        if (playType) {
                            type = thisInfo.tp;
                            style = (type ? (typeClass + ' ' + typeClass + '-' + type) : typeClass);
                            inst.$playType[0].className = style;
                        }
                        var getTitle = function (content_, link_, target_) {
                            //var content, thisLink, thisTarget;
                            if (typeof content_ == 'string' && content_ != '') return content = link_ == 'none' ? content_ : ('<a href="' + link_ + '" target="' + target_ + '">' + content_ + '<\/a>');
                            else if (typeof content_ == 'object') {
                                thisLink = content_.l ? content_.l : link_, thisTarget = content_.g ? content_.g : target_;
                                return content = link_ == 'none' ? content_.t : ('<a href="' + thisLink + '" target="' + thisTarget + '">' + content_.t + '<\/a>');
                            }
                            else return '';
                        },
					getOtherList = function (content_, link_, target_) {
					    if (content_ && !$.isArray(content_)) return getTitle(content_, link_, target_);
					    thisLength = content_.length;
					    thisCont = '';
					    for (j = 0; j < thisLength; j++) thisCont += getTitle(content_[j], link_, target_);
					    return thisCont;
					},
					getOtherTitle = function (content_, link_, target_) {
					    style = self._g(inst, '_otitle');
					    otherList = [];
					    if (typeof content_ == 'string') return '<p class="' + style + '">' + content_ + '<\/p>';
					    if (typeof content_ == 'object') {
					        if (content_ && !$.isArray(content_)) return '<p class="' + style + '"><label class="name">' + getTitle(content_.n, 'none') + ': </label>' + getOtherList(content_.list, link_, target_) + '<\/p>';
					        length = content_.length;
					        for (i = 0; i < length; i++) {
					            content = content_[i];
					            otherList.push('<p class="' + style + '">');
					            otherList.push('<label class="name">' + content.n + ': <\/label>');
					            otherList.push(getOtherList(content.list, link_, target_));
					            otherList.push('<\/p>');
					        }
					        return otherList.join("");
					    }
					},
					getTipsBtn = function (btn, link_, target_, style_) {
					    tipBtn = '<a class="' + style_ + '" href="' + link_ + '" target="' + target_ + '"></a>';
					    if (typeof btn == 'string') tipBtn = '<a class="' + style_ + ' ' + style_ + '-' + btn + '" href="' + link_ + '" target="' + target_ + '"></a>';
					    else if (typeof btn == 'object') {
					        thisBtns = function (btn_, i) {
					            if (!$.isEmptyObject(btn_)) {
					                thisLink = btn_.l ? btn_.l : link_,
									thisTarget = btn_.g ? btn_.g : target_,
									thisStyle = btn_.c ? style_ + '-' + btn_.c : style_,
									thisTitle = btn_.t ? btn_.t : '',
									thisText = btn_.t_ ? btn_.t_ : '';
					                return i & i > 0 ? '<a class="' + style_ + ' ' + style_ + i + ' ' + thisStyle + '" href="' + thisLink + '" target="' + thisTarget + '" title="' + thisTitle + '">' + thisText + '</a>'
												 : '<a class="' + style_ + ' ' + thisStyle + '" href="' + thisLink + '" target="' + thisTarget + '" title="' + thisTitle + '">' + thisText + '</a>'
					            }
					            else return tipBtn;
					        }
					        if ($.isArray(btn)) {
					            for (i = 0; i < btn.length; i++) thisCont += thisBtns(btn[i], i);
					            tipBtn = thisCont;
					        }
					        else tipBtn = thisBtns(btn);
					    }
					    return tipBtn;
					}
                        var info = '',
					h2_ = getTitle(thisInfo.t, link, target),
					h3_ = getTitle(thisInfo.t1, link, target),
					hr_ = '';
                        h2_ = h2_ != '' ? '<h2>' + h2_ + '<\/h2>' : '';
                        h3_ = h3_ != '' ? '<h3>' + h3_ + '<\/h3>' : '';

                        info += h2_ + h3_;
                        otherTitle = thisInfo.ot;
                        otherTitle = otherTitle ? getOtherTitle(otherTitle, link, target) : '';
                        otherTitle ? func : otherTitle = '';
                        message = thisInfo.m ? '<p class="info">' + thisInfo.m + '<\/p>' : '';
                        hr_ = (h2_ != '' || h3_ != '') && (otherTitle != '' || message != '') ? '<hr class="separator" />' : '';
                        info += hr_ + otherTitle + message;
                        if (self._g(inst, 'tipsBtn')) info += getTipsBtn(thisInfo.b_, link, target, self._g(inst, '_tbtn'));
                        self._tipsAnimate(inst, info);
                    }
                },

                _tipsAnimate: function (inst, info) {
                    var $info = inst.$tipsInfo, $tipsBg = inst.$tipsBg, tipsAnimate = this._g(inst, 'tipsAnimate');
                    var $info_ = $info.find('div')//.not('.tips-corner');
                    switch (tipsAnimate) {
                        case 'slide':
                            {
                                info != '' ? ($info_.html('').html(info),
								$info.stop(false, true).slideUp('normal').stop(false, true).slideDown('normal'),
								$tipsBg.stop(false, true).slideUp('normal').stop(false, true).slideDown('normal')
							)
							: (
								$info_.html(''), $info.stop(false, true).slideUp('fast'), $tipsBg.stop(false, true).slideUp('fast')
							);
                                break;
                            }
                        case 'fade':
                            {
                                info != '' ? (
								$info_.html('').html(info),
								$info.stop(false, true).fadeOut('normal').stop(false, true).fadeIn('normal'),
								$tipsBg.stop(false, true).fadeOut('normal').stop(false, true).fadeIn('normal')
							)
							: (
								$info_.html(''), $info.stop(false, true).fadeOut('fast'), $tipsBg.stop(false, true).fadeOut('fast')
							);
                                break;
                            }
                        default:
                            {
                                info != '' ? ($info_.html('').html(info), $info.show(), $tipsBg.show()) : ($info_.html(''), $info.hide(), $tipsBg.hide());
                            }
                    }

                },
                _pf: function (play, speed, total, fun) {
                    var func = fun || function () { };
                    play.siblings().each(function (index) { $(this).css({ 'z-index': total - index }); });
                    play.siblings().stop().animate({ 'opacity': 0 }, speed);
                    play.css('z-index', total + 1).stop().animate({ 'opacity': 1 }, speed, func);
                },
                _plr: function (play, width, total, speed, fun, from) {
                    var left, left_, otherLeft, thisLeft, opacity, $this;
                    var self = this, func = fun || function () { };
                    from === 'left' ? (left = width, left_ = 0 - width) : (left = 0 - width, left_ = width);
                    play.siblings('li').each(function (index) {
                        $this = $(this);
                        $this.css({ 'z-index': total - index });
                        otherLeft = parseInt($this.css('left'));
                        thisLeft = from === 'left' ? left : left_;
                        otherLeft < thisLeft && otherLeft >= 0 ? ($this.animate({ 'left': left_ }, speed, function () { $this.css({ 'left': left }); })) : self.func;
                    })
                    opacity = play.css('opacity')
                    if (opacity && opacity < 1) play.css('opacity', 1)
                    play.stop(true, true).css({ 'z-index': total + 1, 'left': left }).animate({ 'left': 0 }, speed, func);
                },
                _pbt: function (play, height, total, speed, fun, from) {
                    var top, top_, otherTop, thisTop, opacity, $this;
                    var self = this, func = fun || function () { };
                    from === 'bottom' ? (top = height, top_ = 0 - height) : (top = 0 - height, top_ = height);
                    play.siblings('li').each(function (index) {
                        $this = $(this);
                        $this.css({ 'z-index': total - index });
                        otherTop = parseInt($this.css('top'));
                        thisTop = from === 'bottom' ? top : top_;
                        //console.log(otherTop,thisTop);
                        otherTop < thisTop && otherTop >= 0 ? ($this.animate({ 'top': top_ }, speed, function () { $this.css({ 'top': top }); })) : self.func;
                    })
                    opacity = play.css('opacity')
                    if (opacity && opacity < 1) play.css('opacity', 1)
                    play.stop(true, true).css({ 'z-index': total + 1, 'top': top }).animate({ 'top': 0 }, speed, func);
                },

                playPause: function (id) {
                    var inst = this._getInst($('#' + id)[0]);
                    inst.playPause = true;
                },
                playStart: function (id) {
                    var inst = this._getInst($('#' + id)[0]);
                    inst.playPause ? inst.playPause = false : this._doPlayer(inst);
                },

                _resetNav: function (inst) {
                    var self = this,
				bgAnimate = self._g(inst, 'tbgAnimate'),
				place = self._g(inst, 'navPlace'),
				bgSpeed = self._g(inst, 'tbgSpeed'),
				$scroll = inst.$scroll;
                    self._scrollNav(inst, 0, function () { self._enabledBtn(inst); self._disabledBtn(inst, 'prev'); });
                    bgAnimate ? (place == 'lr' ?
							  $scroll.css({ top: 0 }, bgSpeed)
							: $scroll.css({ left: 0 }, bgSpeed)
					   ) : self.func;
                },
                /* Create a new instance object. */
                _newInst: function (elem) {
                    var id = elem[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1');
                    return {
                        id: id,
                        $elem: elem,
                        $nav: null,
                        $btnPrev: '',
                        $btnNext: '',
                        $scroll: '',
                        $navList: '',
                        $player: '',
                        $tipsBg: '',
                        $tipsInfo: '',
                        $playType: '',
                        $playBtns: '',
                        $played: null,
                        $curNav: null,
                        $curPlay: null,
                        hoverPause: false,
                        haveLoad: false,
                        selected: 0,
                        selected_: 0,
                        timeOutID: null,
                        cSelected: 0,
                        loaded: [],
                        navOver: null,
                        data: null,
                        images: [],
                        total: 0,
                        btnClick: true,
                        firstPlay: null,
                        build: false,
                        playPause: false,
                        $extend: null,
                        extend_: 0
                    };
                },

                _g: function (inst, name) {
                    return inst.settings[name] !== undefined ? inst.settings[name]
					: this._defaults[name];
                },

                _getInst: function (target) {
                    try {
                        return $.data(target, PROP_NAME);
                    } catch (err) {
                        throw 'Missing instance data for this contentShown';
                    }
                },
                _optionContentShown: function (target, name, value) {
                    var inst = this._getInst(target);
                    if (arguments.length == 2 && typeof name == 'string') {
                        return (name == 'defaults' ? $.extend({},
						$.contentShownT._defaults) : (inst ? (name == 'all' ? $
						.extend({}, inst.settings) : this._g(inst, name))
						: null));
                    }
                    var settings = name || {};
                    if (typeof name == 'string') {
                        settings = {};
                        settings[name] = value;
                    }
                    if (inst) {
                        extendRemove(inst.settings, settings);
                        inst.build ? inst.build = false : this._instData(inst);
                    }
                    inst = null;
                },
                _extendRemove: function (target, props) {
                    extendRemove(target, props);
                }
            });

            function extendRemove(target, props) {
                $.extend(target, props);
                for (var name in props)
                    if (props[name] == null || props[name] == undefined)
                        target[name] = props[name];
                return target;
            };

            function isArray(data) {
                return (data && (($.browser.safari && typeof data == 'object' && data.length) ||
				(data.constructor && data.constructor.toString().match(/\Array\(\)/))));
            };

            $.fn.contentShown = function (options) {
                if (!this.length)
                    return this;
                if (!$.contentShown.initialized)
                    $.contentShown.initialized = true;

                var otherArgs = Array.prototype.slice.call(arguments, 1);
                if (options == 'option' && arguments.length == 2
				&& typeof arguments[1] == 'string')
                    return $.contentShown['_' + options + 'ContentShown'].apply(
					$.contentShown, [this[0]].concat(otherArgs));
                return this.each(function () {
                    typeof options == 'string' ? $.contentShown['_' + options
					+ 'ContentShown'].apply($.contentShown, [this]
					.concat(otherArgs)) : $.contentShown._initContentShown(
					this, options);
                });
            };

            $.contentShown = new ContentShown();
            $.contentShown.initialized = false;
            $.contentShown.uuid = new Date().getTime();
            $.contentShown.version = "@VERSION";

        })(jQuery);
    } 
});