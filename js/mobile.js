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


    object.onResize = function () {
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
    };

    object.switchConv = function (id, pseudo) {
        $("#conversations").set("$", "open-conv");
        $("#conv-" + id).addClass("open-conv");
        $('#header-title').innerHTML = pseudo;
        if (id !== 0) {
            $("#pvs-" + id).removeClass("new");
        } else {
            $("#chan-0").removeClass("new");
        }
        this.checkNewPvs();
        this.slideNav('left');
    };

    object.checkNewPvs = function () {
        list = $('#msg-private-list').getElementsByClassName('new');
        pellet = $('#pellet-pvs');

        if (list.length > 0) {
            pellet.addClass("new-pvs");
            pellet.textContent = list.length;
        } else {
            pellet.removeClass("new-pvs");
        }
    };

    object.slideNav = function (direction) {
        cls = "open-nav";
        element = $("#slide-nav-" + direction);
        if (!this.hasClass(element, cls)) {
            element.addClass(cls);
            $("#content").addClass(cls);
            $("#content").addClass(direction);
        } else {
            element.removeClass(cls);
            $("#content").removeClass(cls);
            $("#content").removeClass(direction);
        }
    };

    object.slideDown = function (param) {
        cls = "dropdown-open";
        element = param.parentNode;
        if ( !this.hasClass(element, cls) ) {
            element.addClass(cls);
        } else {
            element.removeClass(cls);
        }
    };

    object.popover = function (param) {
        cls = "popover-open";
        element = $.id(param);
        if (!this.hasClass(element, cls)) {
            element.addClass(cls);
        } else {
            element.removeClass(cls);
        }
    };

    object.accordion = function (param, type) {
        cls = "accordionIn";
        list = $.class('option-' + type)[0];
        if (!this.hasClass(list, cls)) {
            list.addClass(cls);
            list.removeClass("is-collapsed");
        } else {
            list.removeClass(cls);
            list.addClass("is-collapsed");
        }
    };

    object.smileToMsg = function (param) {
        element = $('#msg-input');
        element.value += '' + param.title;
        $('#popover-smileys').removeClass('popover-open');
        element.focus();
    };

    object.changeName = function (param) {
        children = param.getElementsByTagName('span');
        element = children[children.length-1];
        pseudo = element.innerHTML;
        if (element.innerHTML.indexOf("(") != -1) {
            pseudo = element.innerHTML.substring(0, element.innerHTML.indexOf("("));
        }
        $('#user-pseudo').innerHTML = pseudo;
    };

    object.removeClass = function (param, cls) {
        $.id(param).removeClass(cls);
    };

    object.hasClass = function (element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    };

    object.inArray = function (needle, haystack) {
        _length = haystack.length, i;
        for (i = 0; i < _length; i++) {
            if(haystack[i].getAttribute('id') == needle) return true;
        }
        return false;
    };

})(window, document, Mobile);
