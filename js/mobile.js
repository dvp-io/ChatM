var version = "2.1.0";
var optionsChat = "";

var userConnect = function () {
    var pseudo = readCookie("anochat_pseudo");
    var password = readCookie('anochat_motdepasse');
    var mode = 1;

    if (pseudo == null) {
        mode = 0;

        pseudo = document.getElementById("login_pseudo").value;
        password = document.getElementById("login_password").value;

        if (pseudo == "") {
            document.getElementById('identMessage').innerHTML = "Vous devez entrer votre identifiant.";
            return;
        }

        if (password == "") {
            document.getElementById('identMessage').innerHTML = "Vous devez entrer votre mot de passe.";
            return;
        }
    }

    var channel = document.getElementById("login_channel").value;

    if (channel == -1) {
        document.getElementById('identMessage').innerHTML = "Vous devez choisir un salon.";
        return;
    }

    if (mode == 0) {
        document.getElementById("login_pseudo").value = "";
        document.getElementById("login_password").value = "";
    }

    document.getElementById('identMessage').innerHTML = "Connexion en cours...";
    document.getElementById('login_send').setAttribute("disabled", true);

    return setConnect(pseudo, password, mode, channel);
};

var setConnect = function (pseudo, password, mode, channel) {
    return setMessage({ q: "conn", v: version, identifiant: pseudo, motdepasse: password, mode: mode,
        decalageHoraire: new Date().getTimezoneOffset(), options: optionsChat, salon: channel });
};

var setMessage = function (donnees) {
    var xhr = getXDomainRequest();

    xhr.open("POST", "http://www.chat.dvp.io/ajax.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(donnees);
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 0) {
        if (xhr.status == 200) {
            return true;
        } else { return false; }
      }
    }
};

var readCookie = function (nom) {
    var deb = document.cookie.indexOf(nom + "=");

    if (deb >= 0) {
        deb += nom.length + 1;
        var fin = document.cookie.indexOf(";", deb);

        if (fin < 0)
            fin = document.cookie.length;

        return unescape(document.cookie.substring(deb, fin));
    }

    return null;
};

var getXDomainRequest = function () {
	var xdr = null;

	if (window.XDomainRequest) {
		xdr = new XDomainRequest();
	} else if (window.XMLHttpRequest) {
		xdr = new XMLHttpRequest();
	} else {
		alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
	}

	return xdr;
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
