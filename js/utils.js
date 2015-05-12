var $ = $ || {};

(function (global, doc, object, undefined) {
    'use strict';

    object.id = function (elmt) {
        return document.getElementById(elmt);
    };

    object.class = function (elmt) {
        return document.getElementsByClassName(elmt);
    };

    object.create = function (elmt) {
        return document.createElement(elmt);
    };

    object.text = function (elmt) {
        return document.createTextNode(elmt);
    };

    object.findAll = function (elmt) {
        return document.querySelectorAll(elmt);
    };
})(window, document, $);
