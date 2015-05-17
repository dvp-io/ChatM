var Mobile = Mobile || {};

(function (global, doc, object, undefined) {
    'use strict';

    var i,
        page,
        _wHeight,
        _length,
        parent,
        children,
        mpList,
        list,
        pellet,
        cls,
        element,
        elements,
        pseudo;


    /*object.onResize = function () {
        elements = $('input, textarea');
        page = $('#wrapper');
        _wHeight = window.innerHeight;
        _length = elements.length;
        for(i = 0; i < _length; i++) {
            elements[i].addEventListener('focus', function () {
                page.set("$height", (_wHeight - 240) + 'px');
                //page.style.height = (_wHeight - 240) + 'px';
            });

            elements[i].addEventListener('blur', function () {
                page.set("$height", _wHeight + 'px');
                //page.style.height = _wHeight + 'px';
            });
        }
    };*/

    object.switchConv = function (id, pseudo) {
        $("#conversations").find('.open-conv').removeClass("open-conv");
        $("#conv-" + id).addClass("open-conv");
        $('#header-title').html(pseudo);
        if (id !== 0) {
            $("#pvs-" + id).removeClass("new");
        } else {
            $("#chan-0").removeClass("new");
        }
        this.checkNewPvs();
        this.slideNav('left');
    };

    object.checkNewPvs = function () {
        list = $('#msg-private-list .new');
        pellet = $('#pellet-pvs');

        if (list.length > 0) {
            pellet.addClass("new-pvs");
            pellet.text(list.length);
        } else {
            pellet.removeClass("new-pvs");
        }
    };

    object.slideNav = function (direction) {
        cls = "open-nav";
        element = $("#slide-nav-" + direction);
        if (!element.hasClass(cls)) {
            element.addClass(cls);
            $("#content").addClass(cls + " " + direction);
        } else {
            element.removeClass(cls);
            $("#content").removeClass(cls + " " + direction);
        }
    };

    object.slideDown = function (param) {
        cls = "dropdown-open";
        element = param.parent();
        if ( !element.hasClass(cls) ) {
            element.addClass(cls);
        } else {
            element.removeClass(cls);
        }
    };

    object.popover = function (param) {
        cls = "popover-open";
        element = $("#" + param);
        if (!element.hasClass(cls)) {
            element.addClass(cls);
        } else {
            element.removeClass(cls);
        }
    };

    object.accordion = function (param, type) {
        cls = "accordionIn";
        list = $(param).find('.option-' + type);
        if (!list.hasClass(cls)) {
            list.addClass(cls).removeClass("is-collapsed");
        } else {
            list.removeClass(cls).addClass("is-collapsed");
        }
    };

    object.smileToMsg = function (param) {
        $("#msg_input").val($("#msg_input").val() + param.title);
        $('#popover-smileys').removeClass('popover-open');
        $("#msg_input").focus();
    };

    object.changeName = function (param) {
        element = $(param).last('span');
        pseudo = $(element).html();
        if ($(element).html().indexOf("(") != -1) {
            pseudo = $(element).html().substring(0, $(element).html().indexOf("("));
        }
        $('#user-pseudo').html(pseudo);
    };

    object.removeClass = function (param, cls) {
        $("#" + param).removeClass(cls);
    };

    /*object.hasClass = function (element, cls) {
        return (' ' + $(element).get("@class") + ' ').indexOf(' ' + cls + ' ') > -1;
    };*/

    object.inArray = function (needle, haystack) {
        console.log(haystack);
        _length = haystack.length, i;
        for (i = 0; i < _length; i++) {
            if(haystack[i].getAttribute('id') == needle) return true;
        }
        return false;
    };

})(window, document, Mobile);
