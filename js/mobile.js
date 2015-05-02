var switchConv = function (id, pseudo) {
    var parent = document.getElementById("conversations");
    var convActive = parent.getElementsByClassName("open-conv");
    convActive[0].classList.remove("open-conv");

    document.getElementById("conv-" + id).classList.add("open-conv");
    document.getElementById('header-title').innerHTML = pseudo;

    // on lui enlève la classe new puisqu'on a switché sur la conv
    if (id !== 0) {
        var pvs = document.getElementById("pvs-" + id);
        pvs.classList.remove("new");
    } else {
        var chan = document.getElementById("chan-0");
        chan.classList.remove("new");
    }

    checkNewPvs();
    slideNav('left');
};

var checkNewPvs = function () {
    var mpList = document.getElementById('msg-private-list');
    var listChild = mpList.getElementsByClassName('new');
    var pellet = document.getElementById('pellet-pvs');

    if (listChild.length > 0) {
        pellet.classList.add("new-pvs");
        pellet.textContent = listChild.length;
    } else {
        pellet.classList.remove("new-pvs");
    }
};

var slideNav = function (direction) {
    var cls = "open-nav";
    var element = document.getElementById("slide-nav-" + direction);
    if (!hasClass(element, cls)) {
        element.classList.add(cls);
        document.getElementById("wrapper").classList.add(cls);
        document.getElementById("wrapper").classList.add(direction);
    } else {
        element.classList.remove(cls);
        document.getElementById("wrapper").classList.remove(cls);
        document.getElementById("wrapper").classList.remove(direction);
    }
};

var slideDown = function (param) {
    var cls = "dropdown-open";
    var element = param.parentNode;
    if ( !hasClass(element, cls) ) {
        element.classList.add(cls);
    } else {
        element.classList.remove(cls);
    }
};

var popover = function (param) {
    var cls = "popover-open";
    var element = document.getElementById(param);
    if (!hasClass(element, cls)) {
        element.classList.add(cls);
    } else {
        element.classList.remove(cls);
    }
};

var smileToMsg = function (param) {
    var input = document.getElementById('msg-input');
    input.value = input.value + '' + param.title;
    document.getElementById('popover-smileys').classList.remove('popover-open');
};

var changeName = function (param) {
    var children = param.getElementsByTagName('span');
    var child = children[children.length-1];
    var pseudo = child.innerHTML;
    if (child.innerHTML.indexOf("(") != -1) {
        pseudo = child.innerHTML.substring(0, child.innerHTML.indexOf("("));
    }
    document.getElementById('user-pseudo').innerHTML = pseudo;
};

var removeClass = function (param, cls) {
    var element = document.getElementById(param);
    element.classList.remove(cls);
};

var hasClass = function (element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

var inArray = function (needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if(haystack[i].getAttribute('id') == needle) return true;
    }
    return false;
};
