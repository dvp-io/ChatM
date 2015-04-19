var slideNav = function( direction ) {
    var cls = "open-nav-" + direction;
    var element = document.getElementById("slide-nav-" + direction);
    if (!hasClass(element, cls)) {
        element.classList.add(cls);
        document.getElementById("wrapper").classList.add(cls);
    } else {
        element.classList.remove(cls);
        document.getElementById("wrapper").classList.remove(cls);
    }
}

var slideDown = function( param ) {
    var cls = "dropdown-open";
    var element = param.parentNode;
    if ( !hasClass(element, cls) ) {
        element.classList.add(cls);
    } else {
        element.classList.remove(cls);
    }
}

var popover = function( ) {
    var cls = "popover-open";
    var element = document.getElementById("about-links");
    if ( !hasClass(element, cls) ) {
        element.classList.add(cls);
    } else {
        element.classList.remove(cls);
    }
}

var hasClass = function(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
