var onResize = function () {
    var selector = document.querySelectorAll('input, textarea');
    for(var i = 0; i < selector.length; i++) {
        console.log(window.innerHeight);
        selector[i].addEventListener('focus', function () {
            var page = document.getElementById('wrapper');
            page.style.height = window.innerHeight + 'px';
        });

        selector[i].addEventListener('blur', function () {
            var page = document.getElementById('wrapper');
            page.style.height = window.innerHeight;
        });
    }
};

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
        document.getElementById("content").classList.add(cls);
        document.getElementById("content").classList.add(direction);
    } else {
        element.classList.remove(cls);
        document.getElementById("content").classList.remove(cls);
        document.getElementById("content").classList.remove(direction);
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

var accordion = function (param, type) {
    var cls = "accordionIn";
    var list = param.getElementsByClassName('option-' + type)[0];
    if (!hasClass(list, cls)) {
        list.classList.add(cls);
        list.classList.remove("is-collapsed");
    } else {
        list.classList.remove(cls);
        list.classList.add("is-collapsed");
    }
};

var smileToMsg = function (param) {
    var input = document.getElementById('msg-input');
    input.value = input.value + '' + param.title;
    document.getElementById('popover-smileys').classList.remove('popover-open');
    input.focus();
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

var fadeIn = function (elementToFade)
{
    var element = document.getElementById(elementToFade);

    element.style.opacity += 0.1;
    if(element.style.opacity > 1.0) {
        element.style.opacity = 1.0;
    } else {
        while(element.style.opacity > 0)
        {
            setTimeout("fadeIn(\"" + elementToFade + "\")", 100);
        }
    }
}

var fadeOut = function (elementToFade)
{
    var element = document.getElementById(elementToFade);

    element.style.opacity -= 0.1;
    if(element.style.opacity < 0.0) {
        element.style.opacity = 0.0;
    } else {
        setTimeout("fadeOut(\"" + elementToFade + "\")", 100);
    }
}
