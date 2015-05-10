var Options = Options || {};

(function (global, doc, object, undefined) {
    object.public = function (pseudo) {
        document.getElementById("msg-input").value = pseudo + "> ";
        document.getElementById("msg-input").focus();
        popover('about-user');
    };

    object.private = function (id, pseudo) {
        if (document.getElementById('pvs-' + id) === null) {
            var div = document.getElementById('msg-private-list');
            var element = document.createElement("li");
            element.classList.add("item");
            element.classList.add("new");
            element.setAttribute("id", "pvs-" + id);
            element.setAttribute("onclick", "switchConv(" + id + ", '" + pseudo + "');");
            element.appendChild(document.createTextNode(pseudo));
            div.appendChild(element);

            var parent = document.getElementById('conversations');
            var conv = document.createElement("div");
            conv.id = "conv-" + id;
            conv.classList.add("conv");
            parent.appendChild(conv);
        }

        switchConv(id, pseudo);
        slideNav('left');
        popover('about-user');
    };

    object.uploadFile = function (id) {

    }

    object.profil = function (id) {
        window.open("http://www.developpez.net/forums/member.php?u=" + id);
    };

    object.quote = function () {
        document.getElementById("msg-input").value += "[QUOTE]";
        document.getElementById("msg-input").focus();
        popover('about-user');
    };

    object.link = function () {
        var link = document.getElementById('link-url').value;
        var libelle = document.getElementById('link-libelle').value;
        var input = document.getElementById('msg-input');
        if (link === "") {
            input.value += "";
        } else if (libelle != "") {
            input.value += "[URL=" + link + "]" + libelle + "[/URL]";
        } else {
            input.value += "[URL]" + link + "[/URL]";
        }
        input.focus();
        popover('about-user');
    };

    object.image = function () {
        var image = document.getElementById('image-libelle').value;
        var input = document.getElementById('msg-input');
        if (image !== "") {
            input.value += "[IMG]" + image + "[/IMG]";
        } else {
            input.value += "";
        }
        input.focus();
        popover('about-user');
    };
})(window, document, Options);
