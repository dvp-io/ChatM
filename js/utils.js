var $ = (function () {
    var jqMock = function (node) {
        this.__elem = node;
    };

    jqMock.prototype = {
        __apply: function (callback) {
            if (this.__elem instanceof Node) {
                return callback(this.__elem);
            }
            var res = [];
            for (var i in this.__elem) {
                res.push(callback(this.__elem[i]));
            }
            return res;
        },
        id: function(id) {
            return new jqMock(this.__apply(function (n) {
                n.getElementById(id);
            }));
        },
        class: function(className) {
            return new jqMock(this.__apply(function (n) {
                n.getElementsByClassName(className);
            }));
        },
        tag: function(tagName) {
            return new jqMock(this.__apply(function (n) {
                n.getElementsByTagName(tagName);
            }));
        },
        create: function (el) {
            return new jqMock(this.__apply(function (n) {
                n.createElement(el);
            }));
        },
        text: function (el) {
            return new jqMock(this.__apply(function (n) {
                n.createTextNode(el);
            }));
        },
        findAll: function (el) {
            return new jqMock(this.__apply(function (n) {
                n.querySelectorAll(el);
            }));
        },
        addClass: function (el) {
            return new jqMock(this.__apply(function (n) {
                n.classList.add(el);
            }));
        },
        removeClass: function (el) {
            return new jqMock(this.__apply(function (n) {
                n.classList.remove(el);
            }));
        },
        attr: function (el, value) {
            return new jqMock(this.__apply(function (n) {
                if (value === undefined) {
                    n.getAttribute(el);
                } else {
                    n.setAttribute(el, value);
                }
            }));
        },
        removeAttr: function (el) {
            return new jqMock(this.__apply(function (n) {
                n.removeAttribute(el);
            }));
        },
        val: function (el) {
            return new jqMock(this.__apply(function (n) {
                if (el === undefined) {
                    n.value;
                } else {
                    n.value = el;
                }
            }));
        },
        html: function (el) {
            return new jqMock(this.__apply(function (n) {
                if (el === undefined) {
                    n.innerHTML;
                } else {
                    n.innerHTML = el;
                }
            }));
        }
    };

    return new jqMock(document);
})(window, document);
