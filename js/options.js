var Options = Options || {};

(function (global, doc, object, undefined) {
    'use strict';

    object.public = function (pseudo) {
        $("#msg_input").val(pseudo + "> ");
        $("#msg_input").focus();
        Mobile.popover('about-user');
    };

    object.private = function (id, pseudo) {
        if ($('#pvs-' + id) === null) {
            var ul = $('#msg-private-list'),
                parent = $('#conversations');

            parent.append("<div></div>")
                .attr({id: "conv-" + id})
                .addClass("conv");

            ul.append("<li>" + pseudo + "</li>")
                .attr({id: "pvs-" + id,
                    onclick: "switchConv(" + id + ", '" + pseudo + "')"})
                .addClass("item new");
        }

        Mobile.switchConv(id, pseudo);
        Mobile.slideNav('left');
        Mobile.popover('about-user');
    };

    object.profil = function (id) {
        window.open("http://www.developpez.net/forums/member.php?u=" + id);
    };

    object.quote = function () {
        $("#msg_input").val($("#msg_input").val() + "[QUOTE]");
        $("#msg_input").focus();
        Mobile.popover('about-user');
    };
})(window, document, Options);
