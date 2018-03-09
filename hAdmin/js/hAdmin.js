
//自定义js

//公共配置


$(document).ready(function () {

    // MetsiMenu
    $('#side-menu').metisMenu();

    // 打开右侧边栏
    $('.right-sidebar-toggle').click(function () {
        $('#right-sidebar').toggleClass('sidebar-open');
    });

    //固定菜单栏
    $(function () {
        $('.sidebar-collapse').slimScroll({
            height: '100%',
            railOpacity: 0.9,
            alwaysVisible: false
        });
    });


    // 菜单切换
    $('.navbar-minimalize').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });


    // 侧边栏高度
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    }
    fix_height();

    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    //侧边栏滚动
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $('.full-height-scroll').slimScroll({
        height: '100%'
    });

    $('#side-menu>li').click(function () {
        if ($('body').hasClass('mini-navbar')) {
            NavToggle();
        }
    });
    $('#side-menu>li li a').click(function () {
        if ($(window).width() < 769) {
            NavToggle();
        }
    });

    $('.nav-close').click(NavToggle);

    //ios浏览器兼容性处理
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $('#content-main').css('overflow-y', 'auto');
    }

});

$(window).bind("load resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('mini-navbar');
        $('.navbar-static-side').fadeIn();
    }
});

function NavToggle() {
    $('.navbar-minimalize').trigger('click');
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(100);
            }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(100);
            }, 100);
    } else {
        $('#side-menu').removeAttr('style');
    }
}


/**
 * 刷新标签页面
 * @param elements 刷新的元素
 */
function g_refreshTab (elements) {
    var target = $('.J_iframe[data-id="' + $(elements).data('id') + '"]');
    var url = target.attr('src');
    //显示loading提示
    var loading = layer.load();
    target.attr('src', url).load(function () {
        //关闭loading提示
        layer.close(loading);
    });
}

/**
 * 创建标签页面
 * @param name 标签页面名字
 * @param url 标签页面URL
 * 
 * iframe调用方式： window.parent.g_createTab("名字","URL")
 */
function g_createTab(name, url) {
	
	//创建标签的flag
	var createFlag = true;
	
	//计算元素集合的总宽度
    var _calSumWidth = function (elements) {
        var width = 0;
        $(elements).each(function () {
            width += $(this).outerWidth(true);
        });
        return width;
    }
    //滚动到指定选项卡
    var _scrollToTab = function (element) {
        var marginLeftVal = _calSumWidth($(element).prevAll()), marginRightVal = _calSumWidth($(element).nextAll());
        // 可视区域非tab宽度
        var tabOuterWidth = _calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".page-tabs-content").outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
            if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                scrollVal = marginLeftVal;
                var tabElement = element;
                while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                    scrollVal -= $(tabElement).prev().outerWidth();
                    tabElement = $(tabElement).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
            scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
        }
        $('.page-tabs-content').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    }
    
    // 判断选项卡菜单已存在
    $('.J_menuTab').each(function () {
        if ($(this).data('id') == url) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                _scrollToTab(this);
                // 显示tab对应的内容区
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == url) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });
            }
            createFlag = false;
            return false;
        }
    });
    
    if (createFlag) {
    	var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + url + '">' + name + ' <i class="fa fa-times-circle"></i></a>';
        $('.J_menuTab').removeClass('active');

        // 添加选项卡对应的iframe
        var str1 = '<iframe class="J_iframe" name="iframe' + name  + '" width="100%" height="100%" src="' + url + '?v=4.0" frameborder="0" data-id="' + url + '" seamless></iframe>';
        $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);

        //显示loading提示
        var loading = layer.load();

        $('.J_mainContent iframe:visible').load(function () {
            //iframe加载完成后隐藏loading提示
            layer.close(loading);
        });
        // 添加选项卡
        $('.J_menuTabs .page-tabs-content').append(str);
        _scrollToTab($('.J_menuTab.active'));
    }
}


/**
 * 关闭当前激活的选项卡菜单
 * 
 * iframe调用方式：window.g_closeCurrentTab()
 * 
 */
function g_closeCurrentTab() {
	
	//关闭当前
	$('.page-tabs-content').children("[data-id]").not(":first").filter(".active").each(function () {
        var activeId = $(this).data('id');
        // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
        var size = $(this).prevAll('.J_menuTab').size()
        if (size) {
            $(this).prev('.J_menuTab:last').addClass('active');
        }
		$('.J_iframe[data-id="' + activeId + '"]').remove();
        $(this).remove();
        
        //显示新的iframe
        var currentActiveId = $(".J_menuTab.active").data("id");
        console.log(currentActiveId);
        $('.J_iframe[data-id="' + currentActiveId + '"]').show();
        
    });
    $('.page-tabs-content').css("margin-left", "0");
}