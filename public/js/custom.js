$(function() {
    'use strict';
    //Deal with Tabs
    $('.tab-switch li').on('click', function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        $($(this).data('class')).siblings().hide().end().fadeIn(300);
    })
    var myNav = $('.navbar');
    $(window).on('scroll', function() {
        //myCondition
        if ($(window).scrollTop() >= myNav.height()) {
            if (!myNav.hasClass('scrolled')) {
                myNav.addClass('scrolled');
            }
        } else {
            myNav.removeClass('scrolled');
        }

    })

})