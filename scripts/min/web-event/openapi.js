define(function(e,t){var n=e("jquery"),r=t,i=function(e){n("body").append("<p>"+e+"</p>")},s=function(e){i("openapi:openAPILogin")},o=function(){var e=n("ul.open-login");typeof e[0]!="undefined"&&n("ul.open-login").click(s)},u=function(e,t,n,r){var i="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(location.href)+"&title="+encodeURIComponent(t)+"&pics="+encodeURIComponent(e)+"&summary="+encodeURIComponent(r)+"&desc="+encodeURIComponent(n);window.open(i)},a=function(e,t){var n="http://service.weibo.com/share/share.php?url="+encodeURIComponent("http://www.paidui.cn")+"&appkey=1661501805&title="+encodeURIComponent(t)+"&pic="+encodeURIComponent(e)+"&ralateUid=2604544522&language=zh_cn";window.open(n)},f=function(e,t,n,r){var i="http://widget.renren.com/dialog/share?url="+encodeURIComponent(location.href)+"&title="+encodeURIComponent(t)+"&pic="+encodeURIComponent(e)+"&description="+encodeURIComponent(n)+"&content="+encodeURIComponent(r);window.open(i)},l=function(e,t){var n="http://share.v.t.qq.com/index.php?c=share&a=index&appkey=100269912&url="+encodeURIComponent(location.href)+"&title="+encodeURI(t).replace(new RegExp("#","gm"),"%23")+"&pic="+encodeURIComponent(e);window.open(n)},c=function(){var e=n("#imgDraw").attr("src"),t=n("#fxTitle").attr("merchant_name")+"!"+n("#fxTitle").attr("coupon_name");u(e,t,"","")},h=function(){var e=n("#imgDraw").attr("src"),t=n("#fxTitle").attr("merchant_name")+"!"+n("#fxTitle").attr("coupon_name");a(e,t)},p=function(){var e=n("#imgDraw").attr("src"),t=n("#fxTitle").attr("merchant_name")+"!"+n("#fxTitle").attr("coupon_name");f(e,t," "," ")},d=function(){var e=n("#imgDraw").attr("src"),t=n("#fxTitle").attr("merchant_name")+"!"+n("#fxTitle").attr("coupon_name")+"（分享自 @@@@paiduiwang2011）";l(e,t)};o(),r.doqzone=c,r.dosina=h,r.dorenren=p,r.dotencent=d,r.openAPILogin=s});