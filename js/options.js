var Options = Options || {};

(function (global, doc, object, undefined) {
    'use strict';

    object.public = function (pseudo) {
        $.id("msg-input").value = pseudo + "> ";
        $.id("msg-input").focus();
        Mobile.popover('about-user');
    };

    object.private = function (id, pseudo) {
        if ($.id('pvs-' + id) === null) {
            var div = $.id('msg-private-list'),
                parent = $.id('conversations'),
                li = $.create("li"),
                div = $.create("div");
            li.classList.add("item");
            li.classList.add("new");
            li.setAttribute("id", "pvs-" + id);
            li.setAttribute("onclick", "switchConv(" + id + ", '" + pseudo + "');");
            li.appendChild($.text(pseudo));
            div.appendChild(li);

            div.id = "conv-" + id;
            div.classList.add("conv");
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
        $.id("msg-input").value += "[QUOTE]";
        $.id("msg-input").focus();
        Mobile.popover('about-user');
    };

    object.link = function () {
        var link = $.id('link-url').value,
            libelle = $.id('link-libelle').value,
            input = $.id('msg-input');
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
        var image = $.id('image-libelle').value,
            input = $.id('msg-input');
        if (image !== "") {
            input.value += "[IMG]" + image + "[/IMG]";
        } else {
            input.value += "";
        }
        input.focus();
        Mobile.popover('about-user');
    };
})(window, document, Options);
