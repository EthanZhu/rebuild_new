define(function(require,exports){
	var $ = require('jquery'),
		opt = require('api-config'),
		open = require('./openapi'),
		attention = require('./attention'),
		dialog = require('./../web-ui/dialog'),
		ui = require('./../web-ui/webui'),
		myTools = exports;
	require('validate')($);
	
	var fCharlen = function (val) {
        return val.replace(/[^\x00-\xff]/g, "**").length;
    };
    
	var fValidateMethod = function(){
		$.validator.addMethod("underscore", function (value, element, param) {
            var regfun = /^(?!_)([\u4e00-\u9fa5]|\w){2,16}$/;
            if (!regfun.test(value) || value.substring(value.length - 1) === "_") {
                return false;
            } else {
                return true;
            }
        });
		
		$.validator.addMethod("charlength", function (value, element) {
            return ((fCharlen(value) > 16) || (fCharlen(value) < 4)) ? false : true;
        });
		
		$.validator.addMethod("regex", function (value, element, regexp) {
            var reg = new RegExp(regexp);
            return this.optional(element) || reg.test(value);
        });
		
		$.validator.addMethod("allDigit", function (value, element) {
            var adf = /^\d+$/;
            return this.optional(element) || !adf.test(value);
        });
	};
	
	var fRresetCoupon = function () {
        var finishBtn, thisBtns, btnSelf;
        opt.data.couponPeople.html(opt.data.backData.CouponInfo.ObtainCount);
        if (!opt.data.backData.CouponInfo.IsObtainEnable) {
            finishBtn = opt.dom.finishBtn;
            if (finishBtn) {
                thisBtns = opt.data.dom.find('.btn')
                thisBtns.off().removeClass('obtain-btn')
                thisBtns.each(function () {
                    btnSelf = $(this);
                    if (btnSelf.hasClass('btnbtm-get')) {
                        btnSelf.removeClass('btnbtm-get').addClass('btnbtm-over');
                    } else {
                        btnSelf.addClass(finishBtn);
                    }
                });
                if (opt.data.dom.data('data-original').type === 'coupon') {
                    thisBtns.text('已领完');
                }
            } else {
                opt.data.dom.addClass('expired');
                opt.data.currentBtn.off().removeClass('btn cpbtn-free');
                if (opt.data.dom.data('data-original').type === 'coupon') {
                    opt.data.currentBtn.text('已领完');
                }
            }
        }
    };
	
    var fLoginEvent = function () {
        var elem = opt.data.dialog;
        $(".btn-login", elem).bind('click', function (e) {
            var username = $("input[name='UserAccount']", elem);
            if (username.val() == '会员名/手机号码') {
                username.val('');
            }
        });

        $("input[name='UserAccount']", elem).val('会员名/手机号码').addClass('gray');
        $("input[name='UserAccount']", elem).focus(function () {
            if ($(this).val() == "会员名/手机号码") {
                $(this).val('').removeClass('gray');
            }
        });
        $("input[name='UserAccount']", elem).blur(function () {
            if ($(this).val() == "") {
                $(this).val("会员名/手机号码").addClass('gray').removeClass('error');
            }
        });

        $('ul.open-login', elem).click(open.openAPILogin);
        $('.close-btn', elem).click(function (e) {
            $.pdw.dialog.close();
        });

        $('.popup-box').addClass('popup-body');
        var form = $('form', elem);
        var errorMsg = $('#errorMsg', elem);
        $('.error-login', elem).hide();
        form.validate({
            debug: true,
            errorPlacement: function (error, element) {
                error.addClass('red field-foot error-login lh1').insertAfter(element.closest('span'), elem);
                error.closest('div').addClass('field-error');
            },
            onkeyup: function () { },
            errorElement: "span",
            rules: {
                UserAccount: { required: true, underscore: true, charlength: true },
                UserPwd: { required: true, rangelength: [6, 16], regex: '^([\\w]|[\\-]){6,16}$' }
            },
            messages: {
                UserAccount: { required: "请输入账号", underscore: "输入的账号格式不正确", charlength: "账号为4至16位,一个汉字为两个字符" },
                UserPwd: { required: "请输入密码", rangelength: "密码长度在6至16位", regex: "输入的密码格式不正确" }
            },
            submitHandler: function () {
                var DefaultLogin = $("input[name='DefaultLogin']"), userName;
                if (DefaultLogin.is(':checked')) { DefaultLogin.val('1'); } else { DefaultLogin.val('0'); }
                $.ajax({
                    url: opt.api.doLoginUrl,
                    data: form.serialize(),
                    success: function (data) {
                        var status = parseInt(data.status), postDt;
                        if (status === 1) {
                            $.pdw.dialog.close();
                            postDt = opt.data.postData;
                            if (postDt) {
                                opt.data.postData = undefined;
                                attention.fAttention(postDt, 'reload');
                            } else {
                                if ($('#pdw_head_user')[0] !== "undefined") {
                                    ui.fHeadHtml(data.data);
                                }
                            }
                        }
                    },
                    error: function (x, y, z) {
                        var reText = x.responseText
                        try {
                            reText = $.parseJSON(x.responseText);
                            if (parseInt(reText.status) != 1) {
                                errorMsg.text(reText.data).show(function () {
                                    setTimeout(function () {
                                        errorMsg.slideUp();
                                    }, 5000);
                                });
                            }
                        } catch (e) {
                            errorMsg.text('登录发生错误，请重试。').show();
                        }
                    }
                });
            }
        });
    };
	
    var fRegisterEvent = function () {
        var elem = opt.data.dialog;
        var pattenName = /^(?!_)([\u4e00-\u9fa5]|\w){2,16}$/,
                allDigit = /^\d+$/i,
                pattenPwd = /^[\w]{6,16}$/i;
        $('ul.open-login', elem).click(open.openAPILogin);
        $('#pdw-user-login').click(function (e) {
            e.preventDefault();
            fInstLogin();
        });

        var pattenName = /^(?!_)([\u4e00-\u9fa5]|\w){2,16}$/,
        allDigit = /^\d+$/i,
        pattenPwd = /^[\w]{6,16}$/i;
        //        $('#pdw-user-login', elem).bind('click', function (e) {
        //            e.preventDefault();
        //            self._instLogin(inst);
        //        })
        //check username is exist
        $("#regUsername", elem).bind('blur', function () {
            //alert('focusout');
            var regUsername = $('#regUsername', elem).val(),
                errorInfo = $('#errorAccount', elem),
                veriCodeImg;

            if (regUsername == "") {
                errorInfo.hide();
                return false;
            }
            if (allDigit.test(regUsername)) {
                errorInfo.hide();
                return false;
            }
            if (!pattenName.test(regUsername)) {
                errorInfo.hide();
                return false;
            }

            if (regUsername.substring(regUsername.length - 1) == "_") {
                errorInfo.hide();
                return false;
            }
            if (fCharlen(regUsername) > 16 || fCharlen(regUsername) < 4) {
                errorInfo.hide();
                return false;
            }

            else {
                errorInfo.hide();
                $.ajax({
                    type: 'post',
                    dataType: "json",
                    url: '/User/CheckAccountIsExists',
                    data: { UserAccount: regUsername },
                    success: function (data) {
                        if (data.status == 1) {
                            errorInfo.text('').addClass('valid').show();
                            $('#isExists', elem).val('1');
                        } else {
                            errorInfo.text('会员名已被注册').removeClass('valid').show();
                            $('#isExists', elem).val('');
                        }
                    }
                });

            }
        });
        veriCodeImg = $("#veri_code").attr("src");
        $("#change_code").click(function (e) {
            e.preventDefault();
            $("#veri_code").attr("src", veriCodeImg + "?timestamp=" + new Date().getTime());
        });

        $('#signupForm', elem).validate({

            success: function (label) {
                label.is(function () {
                    if (($(this).attr('for') == 'regUsername') || ($(this).attr('for') == 'ValidateCode') || ($(this).attr('for') == 'IsRead')) {
                        $(this).hide().remove();
                    } else {
                        label.addClass('valid');
                    }
                });

            },

            errorPlacement: function (error, element) {
                if (element.is(':radio') || element.is(':checkbox')) {
                    error.removeClass('valid').insertAfter(element.parent());
                }
                if (element.is("input[name='ValidateCode']")) {
                    error.removeClass('valid').addClass('red field-foot error-login db lh1').appendTo(element.closest('.field-span'));
                } else {
                    error.removeClass('valid').addClass('red field-foot error-login db lh1').insertAfter(element.closest('span'));
                }

            },
            onkeyup: function () { },
            errorElement: "span",
            ignore: "",
            rules: {
                UserAccount: {
                    required: true, charlength: true, underscore: true, allDigit: true
                },
                UserPwd: { required: true, rangelength: [6, 16], regex: '^[\\w]{6,16}$' },
                ConfirmPwd: { required: true, rangelength: [6, 16], equalTo: '#password' },
                ValidateCode: { required: true },
                IsRead: { required: true },
                isExists: { required: true }
            },
            messages: {
                UserAccount: { required: "请输入会员名", charlength: "会员名长度在4至16位,一个汉字为两个字符", underscore: "会员名格式不正确", allDigit: "会员名不能全为数字" },
                UserPwd: { required: "请输入密码", rangelength: "密码长度在6至16位", regex: "输入的密码格式不正确" },
                ConfirmPwd: { required: "请输入确认密码", rangelength: "密码长度在6至16位", equalTo: "两次密码不一致" },
                ValidateCode: { required: "请输入验证码" },
                IsRead: { required: "请选择同意注册条款" },
                isExists: { required: "会员名已存在" }

            },
            submitHandler: function () {
                //$("#regUsername").blur();
                var IsRead = $("input[name='IsRead']"), account = $("input[name='UserAccount']").val();
                if (IsRead.is(':checked')) { IsRead.val('1'); } else { IsRead.val('0'); }
                $.ajax({
                    type: 'post',
                    url: '/User/DoRegister',
                    global: false,
                    cache: false,
                    dataType: "json",
                    data: {
                        UserAccount: account,
                        UserPwd: $("input[name='UserPwd']").val(),
                        ConfirmPwd: $("input[name='ConfirmPwd']").val(),
                        ValidateCode: $("input[name='ValidateCode']").val(),
                        IsRead: $("input[name='IsRead']").val()

                    },
                    beforeSend: function (x) {
                        x.setRequestHeader("ajax", "true");
                    },
                    error: function (x, y, z) {
                        var response = $.parseJSON(x.responseText);
                        if (response.status != 1) {
                            $("#msg").text(response.data).show(function () {
                                setTimeout(function () {
                                    $("#msg").slideUp();
                                }, 5000);
                            });
                            $("#change_code").click();
                            $("input[name='UserPwd']").val('');
                            $("input[name='ConfirmPwd']").val('');
                            $("input[name='ValidateCode']").val('');
                        }
                    },
                    success: function (data) {
                        var status = parseInt(data.status, 10);
                        if (status === 1) {
                            var postDt = opt.data.postData;
                            if (postDt) {
                                opt.data.postData = undefined;
                                attention.fAttention(postDt, 'reload');
                            } else {
                                ui.fHeadHtml(account);
                            }

                        } else {
                            $("#msg").text(data.data).show();
                            $("#change_code").click();
                        }
                    }
                });
            }
        });
    };
    
    var isLogin = function (login) {
        var loginUrl = opt.api.isLogin, blogin;
        $.ajax({
            url: loginUrl,
            async: false,
            success: function (data) {
                if (parseInt(data.status) === 1) {
                	blogin = true;
                } else {
                	blogin = false;
                }
            },
            error: function (x, y, z) {
            	blogin = false;
                if (login) {
                    myError.fInitError(x);
                    return false;
                }
            }
        });
        return blogin;
    };
    
    var fGetMobile = function () {
        var mobile, mobileUrl = opt.api.getMobile;
        $.ajax({
            url: mobileUrl,
            async: false,
            success: function (data) {
                if (parseInt(data.status) === 1) {
                    mobile = data.data.UserMobileInfo;
                }
            },
            error: function (data) {
                myError.fInitError(data);
                return false;
            }
        });
        return mobile;
    };
    
    var fGetShops = function (postData) {
    	var dataCode, getData, shopsData;
        if (PDW.requestShops) {
            PDW.requestShops.abort();
            PDW.requestShops = undefined;
        }
        PDW.requestShops = $.ajax({
            data: postData,
            async: false,
            url: opt.api.getShopsUrl,
            success: function (data) {
                if (parseInt(data.status) === 1) {
                    shopsData = data.data
                };
            },
            error: function (data) {
                myError.fInitError(data);
                return false;
            }
        });
        return shopsData;
    };
    
    var fInstBtn = function () {
        obxes = $('div.' + opt.dom.boxes);
        obox = $('div.' + opt.dom.box);
        if (typeof obxes[0] !== 'undefined') {
            opt.data.districtId = $(opt.dom.main).attr('district_id');
            fInstData(obxes);
            if (typeof obox[0] !== 'undefined') {
                obox.find('.btn').not('.btn-disabled').off('click').bind('click', function (e) {
                    me = $(this);
                    opt.data.currentBtn = me;
                    self = me.closest('.' + opt.dom.box);
                    opt.data.dom = self;
                    boxData = self.data('data-original');
                    if (boxData) {
                        opt.data.boxData = boxData;
                        e.preventDefault();
                        $.ajax({
                            url: opt.api.IsObtainUrl,
                            data: { id: boxData.sid },
                            success: function (data) {
                                if (parseInt(data.status) === 1) {
                                    coupon.fGetCoupon();
                                } else {
                                    fInstLogin();
                                }
                            },
                            error: function (data) {
                                myError.fInitError(data, 'valid');
                            }
                        })
                    }
                });
            }
        }
    };
    
    var fInstLogin = function () {
        dialog.fLoginHtml();
    };
    
    var fRegister = function () {
        dialog.fRegisterHtml();
    };
    
    fValidateMethod();

    myTools.fGetShops = fGetShops;
    myTools.fInstLogin = fInstLogin;
    myTools.fGetMobile = fGetMobile;
    myTools.isLogin = isLogin;
    myTools.fLoginEvent = fLoginEvent;
    myTools.fRegister = fRegister;
    myTools.fRegisterEvent = fRegisterEvent;
    myTools.fRresetCoupon = fRresetCoupon;
    
});