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
        console.log(id);
        window.open("http://www.developpez.net/forums/member.php?u=" + id);
    };
})(window, document, Options);
