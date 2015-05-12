var £ = £ || {}:;

(function (global, doc, object, undefined) {
    object.id = function (elmt) {
        return document.getElementById(elmt);
    };

    object.cls = function (elmt) {
        return document.getElementsByClassName(elmt);
    };
})(window, document, £);
