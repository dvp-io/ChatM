var Options = Options || {};

(function (global, doc, object, undefined) {
    'use strict';

    object.public = function (pseudo) {
        $("#msg-input").value = pseudo + "> ";
        $("#msg-input").focus();
        Mobile.popover('about-user');
    };

    object.private = function (id, pseudo) {
        if ($('#pvs-' + id) === null) {
            var div = $('#msg-private-list'),
                parent = $('#conversations'),
                li = $.create("li"),
                div = $.create("div");
            li.addClass("item");
            li.addClass("new");
            li.setAttribute("id", "pvs-" + id);
            li.setAttribute("onclick", "switchConv(" + id + ", '" + pseudo + "');");
            li.appendChild($.text(pseudo));
            div.appendChild(li);

            div.id = "conv-" + id;
            div.addClass("conv");
            parent.appendChild(div);
        }

        Mobile.switchConv(id, pseudo);
        Mobile.slideNav('left');
        Mobile.popover('about-user');
    };

    object.profil = function (id) {
        window.open("http://www.developpez.net/forums/member.php?u=" + id);
    };

    object.quote = function () {
        $("#msg-input").value += "[QUOTE]";
        $("#msg-input").focus();
        Mobile.popover('about-user');
    };

    object.link = function () {
        var link = $('#link-url').value,
            libelle = $('#link-libelle').value,
            input = $('#msg-input');
        if (link === "") {
            input.value += "";
        } else if (libelle != "") {
            input.value += "[URL=" + link + "]" + libelle + "[/URL]";
        } else {
            input.value += "[URL]" + link + "[/URL]";
        }
        input.focus();
        Mobile.popover('about-user');
    };

    object.image = function () {
        var image = $('#image-libelle').value,
            input = $('#msg-input');
        if (image !== "") {
            input.value += "[IMG]" + image + "[/IMG]";
        } else {
            input.value += "";
        }
        input.focus();
        Mobile.popover('about-user');
    };
})(window, document, Options);
