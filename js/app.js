var app = angular.module('chatApp', ['angular-gestures', 'ngRoute'], setPostHeader),
    firstConnexion = 0,
    proxyURI = 'http://chat.dvp.io/',
    anoSmileys = {
      'smile.gif': ':)',
      'sad.gif': ':(',
      'wink.gif': ';)',
      'bigsmile.gif': ':D',
      'lol.gif': ':lol:',
      'mouarf.gif': ':mouarf:',
      'haha.gif': ':haha:',
      'ptdr.gif': ':ptdr:',
      'mrgreen.gif': ':mrgreen:',
      'aie.gif': ':aie:',
      'weird.gif': ':weird:',
      'lun1.gif': '8-)',
      'lun2.gif': ':lun:',
      'red.gif': ':oops:',
      'roll.gif': ':roll:',
      'no.gif': ':no:',
      'tongue.gif': ':P',
      'langue.gif': ':langue:',
      'langue2.gif': ':langue2:',
      'confused.gif': ':?',
      'eek.gif': '8O',
      'calim2.gif': ':calim2:',
      'cry.gif': ':cry:',
      'salut.gif': ':salut:',
      'awe.gif': ':hola:',
      'zzz.gif': ':zzz:',
      'cfou.gif': ':cfou:',
      'mur.gif': ':mur:',
      'evil.gif': ':evil:',
      'twisted.gif': ':twisted:',
      'whistle.gif': ':whistle:',
      'whistle2.gif': ':whistle2:',
      'chin.gif': ':chin:',
      'ccool.gif': ':ccool:',
      'koi.gif': ':koi:',
      'zen.gif': ':zen:',
      'roi.gif': ':roi:',
      'nono.gif': ':nono:',
      'ange.gif': ':ange:',
      'calin.gif': ':calin:',
      'kiss.gif': ':kiss:',
      'kiss2.gif': ':kiss2:',
      'zoubi.gif': ':zoubi:',
      'rose.gif': ':rose:',
      'rose2.gif': ':rose2:',
      'fleur.gif': ':fleur:',
      'fleur2.gif': ':fleur2:',
      'heart.gif': ':heart:',
      'java.gif': ':java:',
      'br.gif': ':arrow:',
      'triste.gif': ':triste:',
      'vomi.gif': ':vomi:',
      'alerte.gif': ':alerte:',
      'yeah.gif': ':yeah:',
      'bravo.gif': ':bravo:',
      'fume.gif': ':fume:',
      'salive.gif': ':salive:',
      'toutcasse.gif': ':toutcasse:',
      'fessee.gif': ':fessee:',
      'sm.gif': ':sm:',
      'scarymovie.gif': ':scarymov:',
      'massacre.gif': ':massacre:',
      'rouleau.gif': ':rouleau:',
      'pastaper.gif': ':pastaper:',
      'boulet.gif': ':boulet:',
      'dehors.gif': ':dehors:',
      'google.gif': ':google:',
      'dvp.png': ':dvp:'
    },
    version = "2.1.0",
    optionsChat = "",
    session,
    lastData,
    a = 0;

function setPostHeader($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (var i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (var subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        }
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    }).when('/chat', {
        templateUrl: 'templates/chat.html',
        controller: 'ChatController'
    }).otherwise({
        redirectTo: '/login'
    });
}]);

app.service('sharedProperties', function () {
    var data = [];
    var etat = 0;
    var channel = "";
    var idConvActive = 0;
    var channelConnexion = "";

    return {
        getData: function () {
            return data;
        },
        setData: function(value) {
            data = value;
        },
        getSession: function () {
            return session;
        },
        setSession: function (value) {
            session = value;
        },
        getVersion: function () {
            return version;
        },
        getEtat: function () {
            return etat;
        },
        setEtat: function (value) {
            etat = value;
        },
        getChannelActive: function () {
            return channel;
        },
        setChannelActive: function (value) {
            channel = value;
        },
        getIdConvActive: function () {
            return idConvActive;
        },
        setIdConvActive: function (value) {
            idConvActive = value;
        },
        getChannelConnexion: function () {
            return channelConnexion;
        },
        setChannelconnexion: function (value) {
            channelConnexion = value;
        }
    };
});

app.directive('backButton', function(){
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            element.bind('click', goBack);

            function goBack() {
                history.back();
                scope.$apply();
            }
        }
    }
});

app.directive('formButton', function($compile) {
    return {
        restrict: "E",
        replace: true,
        scope : {
            item: '='
        },
        link:  function (scope, element, attrs) {
            element.html('<button ng-if="item.input==\'button\'" class="{{item.class}}" ng-click="item.function();">{{item.libelle}}</button>');
            $compile(element.contents())(scope);
        }
    }
});

app.factory('setMessage', function ($http, sharedProperties, $location) {
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

    var setMessage = {
        getData : function (json) {
            sharedProperties.setData(json);
            return $http({
                method: 'POST',
                url: proxyURI.concat('ajax.php'),
                cache: false,
                data: json
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) { return false; });
        },

        doStatus : function (data) {
            sharedProperties.setData(data);
            sharedProperties.setEtat(data.etat);
            if (data.etat === -1) {
                $location.path('/login');
                $.id('login_send').removeAttribute("disabled");
            }
            else if (data.etat === 0) {
                $location.path('/login');
                $.id("identMessage").classList.add("active");
                $.id("identMessage").innerHTML = data.message;
                $.id('login_send').removeAttribute("disabled");
            }
            else if (data.etat === 2) {
                sharedProperties.setSession(data.session);
                if (firstConnexion === 0) {
                    Mobile.popover('login');
                    $location.path('/chat');
                }
            }
        },

        userConnect : function () {
            var pseudo = readCookie("anochat_pseudo");
            var password = readCookie('anochat_motdepasse');
            var mode = 1;

            if (pseudo == null) {
                mode = 0;

                pseudo = $.id("login_pseudo").value;
                password = $.id("login_password").value;

                if (pseudo == "") {
                    $.id('identMessage').classList.add("active");
                    $.id('identMessage').innerHTML = "Vous devez entrer votre identifiant.";
                    return;
                }

                if (password == "") {
                    $.id('identMessage').classList.add("active");
                    $.id('identMessage').innerHTML = "Vous devez entrer votre mot de passe.";
                    return;
                }
            }

            var channel = $.id("login_channel").value;

            if (channel == -1) {
                $.id('identMessage').classList.add("active");
                $.id('identMessage').innerHTML = "Vous devez choisir un salon.";
                return;
            }

            sharedProperties.setChannelActive(channel);

            if (mode == 0) {
                $.id("login_pseudo").value = "";
                $.id("login_password").value = "";
            }

            $.id('identMessage').classList.add("active");
            $.id('identMessage').innerHTML = "Connexion en cours...";
            $.id('login_send').setAttribute("disabled", true);

            return { q: "conn", v: sharedProperties.getVersion(), identifiant: pseudo, motdepasse: password, mode: mode,
                decalageHoraire: new Date().getTimezoneOffset(), options: optionsChat, salon: channel };
        }
    };
    return setMessage;
});

app.factory('loadData', function (sharedProperties, setMessage, $timeout, $compile, $sce, $templateRequest) {
    var addFunction = function (scope) {
        var users = $.id("slide-nav-right").getElementsByClassName("nomConnecte"),
            channels = $.id("slide-nav-right").getElementsByClassName("nomSalon"),
            i;

        for (i = 0; i < users.length; i++) {
            if (users[i] !== null) {

                users[i].onclick = function () {
                    var regex_users = /<a[^>]+?ouvrirMenuUtilisateur\((\d+),&quot;(.+?)&quot;,(-?\d),(-?\d),(-?\d),(-?\d),(-?\d),(-?\d),(-?\d),(-?\d)\).+?(?: \(([^<]+?)\)(?:<\/span>)?)?<\/a>/g,
                        res = regex_users.exec(this.outerHTML),
                        id = res[1],
                        pseudo = res[2],
                        ignore = res[5];

                    Mobile.changeName(this);
                    Mobile.aboutUser(id, pseudo, ignore, scope);
                    Mobile.slideNav('right');
                    return false;
                };
            }
        }

        for (chan in channels) {
            if (channels.item(chan) !== null) {
                channels.item(chan).onclick = function () {return false;};
            }
        }
    };

    var createUsersList = function (users, scope) {
        var list = $.id('users-list');
        list.innerHTML = users;

        addFunction(scope);
    };

    var createLineChannel = function (channel) {
        channel = (channel !== "") ? channel.replace(/src="\/?(images|smileys)\//g, 'src="' + proxyURI + "/$1/") : channel;
        var conv = $.id('conv-0'),
            item = $.create('div');
        item.setAttribute('class', 'line');
        item.innerHTML = channel;
        conv.appendChild(item);
        conv.scrollTop = conv.scrollHeight;
    };

    var createPvsElement = function (pvs) {
        var mpList = $.id('msg-private-list'),
            listChild = mpList.children;
        //console.log(listChild);
        angular.forEach(pvs, function (key, value) {
            if (!inArray("pvs-" + key.id, listChild)) {
                var item = $.create("li"),
                    parent = $.id('conversations'),
                    conv = $.create("div");
                // ici on crée l'onglet de la conv dans le menu de gauche
                item.setAttribute("class", "item new");
                item.setAttribute("id", "pvs-" + key.id);
                item.setAttribute("onclick", "switchConv(" + key.id + ", '" + key.pseudo + "');");
                item.appendChild($.text(key.pseudo));
                mpList.appendChild(item);

                // ici on crée la div qui va accueillir la conv pvs
                conv.setAttribute("id", "conv-" + key.id);
                conv.setAttribute("class", "conv");
                parent.appendChild(conv);
            } else {
                if (!Mobile.hasClass($.id("conv-" + key.id), "open-conv")) {
                    $.id("pvs-" + key.id).setAttribute("class", "item new");
                }
            }

            addMsgPvs(key.id, key.html);
        });
    };

    var addMsgPvs = function (id, html) {
        var conv = $.id('conv-' + id),
            item = $.create('div');
        item.setAttribute('class', 'line');
        item.innerHTML = html;
        conv.appendChild(item);
    };

    var ignore = function (id, statut, scope) {
        var texte = "/IGNORE " + statut + " " + id;
        setMessage.getData({q:"cmd", v:sharedProperties.getVersion(), s:sharedProperties.getSession(), c: texte, a: a++}).then(function (response) {
            $.id("msg-input").value = "";
            $.id("msg-input").focus();
            setMessage.doStatus(response.data);
            scope.data = loadData.getData(scope);
            Mobile.popover('about-user');
        });
    };

    var aboutUser = function (id, pseudo, ignoreState, scope) {
        var config = {"0": {"title":"Parler en public", "icon":"icon-bubbles3", "multiple":false, "function":"Options.public('" + pseudo + "')"}
            , "1": {"title":"Dialoguer en privé", "icon":"icon-bubble2", "multiple":false, "function":"Options.private(" + id + ", '" + pseudo + "')"}
            /*, "2": {"title":"Envoyer un fichier", "icon":"icon-upload2", "multiple":false, "function":"Options.uploadFile(" + id + ")"}*/
            , "3": {"title":"Bloquer/Ignorer", "icon":"icon-blocked", "multiple":"list"
               , "items":{
                   "0": {"title":"Bloquer", "desc":" : Cette option empêche ce correspondant de vous contacter en privé.", 0:"BLOCK", 1:"OFF"},
                   "1": {"title":"Ignorer", "desc":" : Cette option empêche ce correspondant de vous contacter en privé ; de plus, vous ne verrez plus ses messages s'afficher sur le salon.", 0:"FULL", 2:"OFF"}
               }
            }
          , "4": {"title":"Voir le profil", "icon":"icon-user", "multiple":false, "function":"Options.profil(" + id + ")"}
        };

        scope.aboutUser = {};
        scope.aboutUser.id = id;
        scope.aboutUser.data = config;
        scope.aboutUser.isIgnore = ignoreState;
        scope.aboutUser.switchOn = (ignoreState > 0) ? true : false;
        scope.checkStatus = function (item) {
            if (item[ignoreState] !== undefined) {
                ignore(id, item[ignoreState], scope);
            }
        }

        Mobile.popover('about-user');
    }

    var loadData = {
        getData: function ($scope) {
            if (sharedProperties.getData() !== undefined) {
                var chanActive = sharedProperties.getData().nomSalon;
                if (chanActive !== undefined) {
                    sharedProperties.setChannelconnexion(sharedProperties.getData().nomSalon);
                    switch (chanActive) {
                        case "Développement Applicatif" :
                            $scope.data.nomSalon = "Dev. App.";
                            break;
                        case "Développement Web" :
                            $scope.data.nomSalon = "Dev. Web";
                            break;
                        default :
                            $scope.data.nomSalon = chanActive;
                            break;
                    }
                }

                if (sharedProperties.getData().connectes !== "") {
                    loadData.createChannelsList(sharedProperties.getData().connectes, $scope);
                    createUsersList(sharedProperties.getData().connectes, $scope);
                }

                if (sharedProperties.getData().smileys !== undefined) {
                    $scope.data.smileys = sharedProperties.getData().smileys;
                }

                $timeout(function () {
                    createLineChannel(sharedProperties.getData().salon);
                    if (sharedProperties.getData().pvs.length > 0) {
                        createPvsElement(sharedProperties.getData().pvs);
                    }

                    if (sharedProperties.getData().smileys !== undefined) {
                        var div = $.id('list-smileys-perso'),
                            list = div.getElementsByTagName("a"),
                            link;
                        for (i = 0; i < list.length; i++) {
                            list[i].setAttribute("onclick", "smileToMsg(this); return false;");
                            link = list[i].getElementsByTagName('img')[0].getAttribute("src");
                            list[i].getElementsByTagName('img')[0].setAttribute("src", proxyURI + link);
                        }
                    }

                    Mobile.checkNewPvs();
                });
            }
            return $scope.data;
        },

        getChannel: function () {
            var chanActive = "",
                element = $.id('slide-nav-left').getElementsByClassName('item-' + sharedProperties.getChannelActive())[0],
                channels = $.id('slide-nav-left').getElementsByClassName('nomSalon'),
                nameChannel;
            if (sharedProperties.getData().nomSalon === undefined) {
                chanActive = sharedProperties.getChannelConnexion().replace(" ", "_");
            } else {
                chanActive = sharedProperties.getData().nomSalon.replace(" ", "_");
            }
            element.removeAttribute("ng-click");
            element.classList.add("active");
            element.classList.add("new");
            element.setAttribute("id", "chan-0");
            element.setAttribute("name", chanActive);
            element.onclick = function () {
                Mobile.switchConv(0, element.innerHTML);
                return false;
            }

            for (var i = 0; i < channels.length; i++) {
                if (channels[i].id === "") {
                    channels[i].onclick = function () {return false;};
                    nameChannel = channels[i].innerHTML.split(" [");
                    channels[i].setAttribute("ng-click", "switchChannel('/JOIN', '" + nameChannel[0].replace(" ", "_") + "', $event);");
                }
            }
        },

        createChannelsList: function (list, $scope) {
            var regex = /<a[^>]+?ouvrirMenuSalon\("(.+?)",[^<]+?<\/a>/g,
                salons = {},
                res,
                i = 10,
                ul = $.id("channels-list"),
                id,
                li;
            while (res = regex.exec(list)) {
                salons[i] = res[1];
                i += 10;
            }
            ul.innerHTML = "";
            for(id in salons) {
                li = $.create("li");
                li.classList.add("item");
                li.classList.add("item-" + id);
                li.setAttribute("ng-click", "switchChannel('/JOIN', '" + salons[id].replace(" ", "_") + "', " + id + ", $event);");
                li.innerHTML = salons[id];
                ul.appendChild(li);
            }
            loadData.getChannel();
            $compile(ul.children)($scope);
        },

        aboutOptions: function (scope) {
            var config = {/*"0": {"title":"Code", "icon":"icon-embed2", "multiple":false, "function":""}
                , */"1": {"title":"Citer", "icon":"icon-quotes-left", "multiple":false, "function":"Options.quote();"}
                , "2": {"title":"Lien", "icon":"icon-link", "multiple":"form"
                    , "items": {
                        "0": {"input":"text", "libelle":"Lien", "id":"link-url", "class":"input"},
                        "1": {"input":"text", "libelle":"Libellé (facultatif)", "id":"link-libelle", "class":"input"},
                        "2": {"input":"button", "libelle":"Insérer", "class":"btn", function:scope.link}
                    }
                }
                , "3": {"title":"Image", "icon":"icon-image", "multiple":"form"
                    , "items": {
                        "0": {"input":"text", "libelle":"Insérer une image", "id":"image-libelle", "class":"input"},
                        "1": {"input":"button", "libelle":"Insérer", "class":"btn", function:scope.image}
                    }
                }
                , "4": {"title":"Statut", "icon":"icon-pencil2", "multiple":"form"
                    , "items": {
                        "0": {"input":"text", "libelle":"Statut personnalisé", "id":"away", "class":"input", "maxsize":"150"},
                        "1": {"input":"button", "libelle":"Changer le statut", "class":"btn", function:scope.away}
                    }
                }
            };

            scope.aboutUser = {};
            scope.aboutUser.data = config;
        }
    };
    return loadData;
});

app.factory('tmpAction', function () {
    var tmpAction = {
        passUserOpt : function (id, pseudo, ignore, scope) {
            return UserOpt.aboutUser(id, "'" + pseudo + "'", ignore, scope);
        }
    };

    return tmpAction;
});

app.controller('LoginController', function (sharedProperties, setMessage, loadData, $scope) {
    $scope.ngUserConnect = function () {
        var json = setMessage.userConnect();
        if (json !== undefined) {
            setMessage.getData(json).then(function (response) {
                setMessage.doStatus(response.data);
                if (sharedProperties.getEtat() === 2) {
                    firstConnexion = 1;
                }
            });
        }
    };
});

app.controller('ChatController', function (sharedProperties, setMessage, loadData, $scope, $sce, $interval, $location) {

    Mobile.onResize();

    window.onbeforeunload = function (event) {
        var message = "";
        if (typeof event == 'undefined') {
            event = window.event;
        }
        if (event) {
            event.returnValue = message;
        }
        return message;
    }

    if (sharedProperties.getSession() === undefined) {
        $location.path('/login');
    } else {
        $scope.data = [];

        $scope.data = loadData.getData($scope);
        $scope.data.anoSmileys = anoSmileys;
        $scope.data.proxyURI = proxyURI;
        $scope.showClean = true;
    }

    var interval = $interval(function () {
        if (sharedProperties.getEtat() < 1) {
            stopInterval();
        } else {
            setMessage.getData({q: "act", v: sharedProperties.getVersion(), s: sharedProperties.getSession(), a: a++}).then(function (response) {
                setMessage.doStatus(response.data);
                $scope.data = loadData.getData($scope);
            });
        }
    }, 3000);

    var stopInterval = function () {
        $interval.cancel(interval);
    };

    var HandleBackFunctionality = function () {
        if(window.event) {
            if(window.event.clientX < 40 && window.event.clientY < 0) {
                alert("Browser back button is clicked...");
            } else {
                alert("Browser refresh button is clicked...");
            }
        } else {
            if(event.currentTarget.performance.navigation.type == 1) {
                alert("Browser refresh button is clicked...");
            }
            if(event.currentTarget.performance.navigation.type == 2) {
                alert("Browser back button is clicked...");
            }
        }
    }

    $scope.toTrustedHTML = function (html) {
        return $sce.trustAsHtml(html);
    };

    $scope.logout = function () {
        stopInterval();
        setMessage.getData({ q: "cmd", v: version, s: session, c: "/QUIT", a: a++});
        $location.path("/login");
        firstConnexion = 0;
    };

    $scope.aboutOptions = function () {
        loadData.aboutOptions($scope);
        Mobile.popover('about-user');
    };

    $scope.send = function () {
        var convActive = $.id('conversations').getElementsByClassName('open-conv')[0].getAttribute('id'),
            idConvActive = convActive.split("conv-")[1],
            texte = $.id("msg-input").value;
        if (parseInt(idConvActive) !== 0) {
            texte = "/TELL " + idConvActive + " " + texte;
        }

        setMessage.getData({ q: "cmd", v: version, s: session, c: texte, a: a++ }).then(function (response) {
            $.id("msg-input").value = "";
            $scope.showClean = true;
            $.id("msg-input").focus();
            setMessage.doStatus(response.data);
            $scope.data = loadData.getData($scope);
        });
    };

    $scope.keyEnter = function (keyCode) {
        if ($.id("msg-input").value === "") {
            $scope.showClean = true;
        } else {
            $scope.showClean = false;
        }
        if (keyCode === 13) {
            $scope.send();
        }
    };

    $scope.clean = function (id) {
        $.id(id).value = "";
        $.id(id).focus();
        $scope.showClean = true;
    }

    $scope.switchChannel = function (cmd, channel, id, $event) {
        sharedProperties.setChannelActive(id);

        var chanActive = $.id("chan-0"),
            nameChanActive = chanActive.getAttribute("name"),
            element = $event.target;

        chanActive.onclick = function () {return false;};
        chanActive.removeAttribute("name");
        chanActive.removeAttribute("id");
        chanActive.classList.remove("active");
        chanActive.classList.remove("new");
        chanActive.setAttribute("ng-click", "switchChannel('/JOIN', '" + nameChanActive + "', " + id + ", $event);");

        element.removeAttribute("ng-click");
        element.classList.add("active");
        element.classList.add("new");
        element.setAttribute("id", "chan-0");
        element.setAttribute("name", channel);
        element.onclick = Mobile.switchConv(0, element.innerHTML);

        setMessage.getData({ q: "cmd", v: version, s: session, c: cmd + " " + channel, a: a++}).then(function (response) {
            $.id("msg-input").value = "";
            setMessage.doStatus(response.data);
            $scope.data = loadData.getData($scope);
        });
    };

    $scope.checkAccordion = function (value, $event, menu) {
        if (value != false) {
            Mobile.accordion($event.target.parentNode, value);
        } else {
            eval(menu.function);
        }
    };

    $scope.link = function () {
        Options.link();
    };

    $scope.image = function () {
        Options.image();
    };

    $scope.away = function () {
        var message = $.id('away').value;
        var texte = "/AWAY " + message;
        setMessage.getData({ q: "cmd", v: version, s: session, c: texte, a: a++ }).then(function (response) {
            $.id("msg-input").focus();
            setMessage.doStatus(response.data);
            $scope.data = loadData.getData($scope);
        });

        Mobile.popover('about-user');
    };

    $scope.myNavSwipeRight = function () {
        if (!Mobile.hasClass($.id('slide-nav-left'), 'open-nav') && !Mobile.hasClass($.id('slide-nav-right'), 'open-nav')) {
            Mobile.slideNav('left');
        } else if (!Mobile.hasClass($.id('slide-nav-left'), 'open-nav') && Mobile.hasClass($.id('slide-nav-right'), 'open-nav')) {
            Mobile.slideNav('right');
        }
    };

    $scope.myNavSwipeLeft = function () {
        if (Mobile.hasClass($.id('slide-nav-left'), 'open-nav') && !Mobile.hasClass($.id('slide-nav-right'), 'open-nav')) {
            Mobile.slideNav('left');
        } else if (!Mobile.hasClass($.id('slide-nav-left'), 'open-nav') && !Mobile.hasClass($.id('slide-nav-right'), 'open-nav')) {
            Mobile.slideNav('right');
        }
    };

    $scope.myPopoverSwipeDown = function () {
        Mobile.popover('about-user');
    };
});
