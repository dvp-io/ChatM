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
                $('#login_send').disabled = false;
            }
            else if (data.etat === 0) {
                $location.path('/login');
                $("#identMessage").addClass("active");
                $("#identMessage").html(data.message);
                $('#login_send').disabled = false;
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
            var pseudo = readCookie("anochat_pseudo"),
                password = readCookie('anochat_motdepasse'),
                form,
                mode = 1;


            if (pseudo == null) {
                mode = 0;

                pseudo = $("#login_pseudo").val();
                password = $("#login_password").val();
                if (pseudo == "") {
                    $('#identMessage').addClass("active");
                    $('#identMessage').html("Vous devez entrer votre identifiant.");
                    return;
                }

                if (password == "") {
                    $('#identMessage').addClass("active");
                    $('#identMessage').html("Vous devez entrer votre mot de passe.");
                    return;
                }
            }

            var channel = $("#login_channel").val();

            if (channel == -1) {
                $('#identMessage').addClass("active");
                $('#identMessage').html("Vous devez choisir un salon.");
                return;
            }

            sharedProperties.setChannelActive(channel);

            if (mode == 0) {
                $("#login_pseudo").val("");
                $("#login_password").val("");
            }

            $('#identMessage').val("active");
            $('#identMessage').html("Connexion en cours...");
            $('#login_send').disabled = true;

            return { q: "conn", v: sharedProperties.getVersion(), identifiant: pseudo, motdepasse: password, mode: mode,
                decalageHoraire: new Date().getTimezoneOffset(), options: optionsChat, salon: channel };
        }
    };
    return setMessage;
});

app.factory('loadData', function (sharedProperties, setMessage, $timeout, $compile, $sce, $templateRequest) {
    var createUsersList = function (users, scope) {
        var list = $('#users-list').html(users),

            users = $("#slide-nav-right .nomConnecte"),
            channels = $("#slide-nav-right .nomSalon"),
            i;

        console.log(users);
        users.each(function (index, user) {
            if (user !== null) {
                var regex_users = /<a[^>]+?ouvrirMenuUtilisateur\((\d+),&quot;(.+?)&quot;,(-?\d),(-?\d),(-?\d),(-?\d),(-?\d),(-?\d),(-?\d),(-?\d)\).+?(?: \(([^<]+?)\)(?:<\/span>)?)?<\/a>/g,
                    res = regex_users.exec($(user).outerHTML()),
                    id = res[1],
                    pseudo = res[2],
                    ignore = res[5];

                $(user).removeAttr("onclick");
                $(user).attr("onclick", "Mobile.changeName(this); Mobile.slideNav('right'); return false;");
                $(user).attr("ng-click", "aboutUser(" + id + ", '" + pseudo + "', " + ignore + ");");
            }
        });
        $compile(users)(scope);

        channels.each(function (item, index) {
            $(item).attr("onclick", "return false;");
        });
    };

    var createLineChannel = function (channel) {
        channel = (channel !== "") ? channel.replace(/src="\/?(images|smileys)\//g, 'src="' + proxyURI + "/$1/") : channel;
        var conv = $('#conv-0');
        $("<div></div>").appendTo(conv).addClass("line").html(channel);
        conv.scrollTop = conv.scrollHeight;
    };

    var createPvsElement = function (pvs) {
        var mpList = $('#msg-private-list'),
            listChild = $('#msg-private-list li'),
            conv = $('#conversations');
        angular.forEach(pvs, function (key, value) {
            if (!Mobile.inArray("pvs-" + key.id, listChild)) {
                $("<li>" + key.pseudo + "</li>").appendTo(mpList).attr({id: "pvs-" + key.id,
                    onclick: "Mobile.switchConv(" + key.id + ", '" + key.pseudo + "');"}).addClass("item new");

                // ici on crée la div qui va accueillir la conv pvs
                $("<div></div>").appendTo(conv).attr({id: "conv-" + key.id}).addClass("conv");
            } else {
                if (!$("#conv-" + key.id).hasClass("open-conv")) {
                    $("#pvs-" + key.id).addClass("item new");
                }
            }

            addMsgPvs(key.id, key.html);
        });
    };

    var addMsgPvs = function (id, html) {
        $("<div>" + html + "</div>").appendTo("#conv-" + id).addClass("line");
    };

    var ignore = function (id, statut, scope) {
        var texte = "/IGNORE " + statut + " " + id;
        setMessage.getData({q:"cmd", v:sharedProperties.getVersion(), s:sharedProperties.getSession(), c: texte, a: a++}).then(function (response) {
            $("#msg-input").val("");
            $("#msg_input").focus();
            setMessage.doStatus(response.data);
            scope.data = loadData.getData(scope);
            Mobile.popover('about-user');
        });
    };

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
                        var list = $('#list-smileys-perso a'),
                            link;
                        for (i = 0; i < list.length; i++) {
                            list[i].attr("onclick", "Mobile.smileToMsg(this); return false;");
                            link = $('#list-smileys-perso a img').attr("src");
                            $(list[i] + " img").attr("src", proxyURI + link);
                        }
                    }

                    Mobile.checkNewPvs();
                });
            }
            return $scope.data;
        },

        getChannel: function () {
            var chanActive = "",
                element = $('#slide-nav-left .item-' + sharedProperties.getChannelActive()),
                channels = $('#slide-nav-left').find('.item'),
                nameChannel;

            if (sharedProperties.getData().nomSalon === undefined) {
                chanActive = sharedProperties.getChannelConnexion().replace(" ", "_");
            } else {
                chanActive = sharedProperties.getData().nomSalon.replace(" ", "_");
            }

            for (var i = 0; i < channels.length; i++) {
                if ($(channels[i]).attr("id") === "") {
                    nameChannel = channels[i].html().split(" [");
                    $(channels[i]).removeAttr("onclick").attr({"ng-click": "switchChannel('/JOIN', '" + nameChannel[0].replace(" ", "_") + "', $event);"});
                }
            }

            element.removeAttr("ng-click").attr({id: "chan-0",
                name: chanActive,
                onclick: "Mobile.switchConv(0, '" + element.html() + "'); return false;"}).addClass("active new");
        },

        createChannelsList: function (list, $scope) {
            var regex = /<a[^>]+?ouvrirMenuSalon\("(.+?)",[^<]+?<\/a>/g,
                salons = {},
                res,
                i = 10,
                ul = $("#channels-list"),
                id;
            while (res = regex.exec(list)) {
                salons[i] = res[1];
                i += 10;
            }
            ul.html("");
            for(id in salons) {
                $("<li>" + salons[id] + "</li>").appendTo(ul)
                    .addClass("item item-" + id)
                    .attr("ng-click", "switchChannel('/JOIN', '" + salons[id].replace(" ", "_") + "', " + id + ", $event);");
            }
            loadData.getChannel();
            $compile(ul.contents())($scope);
        },

        aboutUser: function (id, pseudo, ignoreState, scope) {
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
        },

        aboutOptions: function (scope) {
            var config = {/*"0": {"title":"Code", "icon":"icon-embed2", "multiple":false, "function":""}
                , */"1": {"title":"Citer", "icon":"icon-quotes-left", "multiple":false, "function":"Options.quote();"}
                , "2": {"title":"Lien", "icon":"icon-link", "multiple":"form"
                    , "items": {
                        "0": {"input":"text", "libelle":"Lien", "id":"link_url", "class":"input"},
                        "1": {"input":"text", "libelle":"Libellé (facultatif)", "id":"link_libelle", "class":"input"},
                        "2": {"input":"button", "libelle":"Insérer", "class":"btn", function:scope.link}
                    }
                }
                , "3": {"title":"Image", "icon":"icon-image", "multiple":"form"
                    , "items": {
                        "0": {"input":"text", "libelle":"Insérer une image", "id":"image_libelle", "class":"input"},
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

    //Mobile.onResize();

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

    $scope.aboutUser = function (id, pseudo, ignore) {
        loadData.aboutUser(id, pseudo, ignore, $scope);
    }

    $scope.send =  function () {
        var convActive = $('#conversations .open-conv').attr('id'),
            idConvActive = convActive.split("conv-")[1],
            texte = $("#msg_input").val();
        if (parseInt(idConvActive) !== 0) {
            texte = "/TELL " + idConvActive + " " + texte;
        }
        setMessage.getData({ q: "cmd", v: version, s: session, c: texte, a: a++ }).then(function (response) {
            $scope.msg = "";
            $("#msg_input").val("").focus();

            $scope.showClean = true;
            setMessage.doStatus(response.data);
            $scope.data = loadData.getData($scope);
        });
    };

    $scope.keyEnter = function (keyCode) {
        if ($scope.msg === "") {
            $scope.showClean = true;
        } else {
            $scope.showClean = false;
        }
        if (keyCode === 13) {
            $scope.send();
        }
    };

    $scope.clean = function (id) {
        console.log("clean : " + $scope.msg);
        $scope.msg = "";
        $("#" + id).val("").focus();
        $scope.showClean = true;
    }

    $scope.switchChannel = function (cmd, channel, id, $event) {
        sharedProperties.setChannelActive(id);

        var chanActive = $("#chan-0"),
            nameChanActive = chanActive.attr("name"),
            element = $event.target;

        chanActive.on("click",function () {return false;});
        chanActive.removeAttr("name id").attr({ngClick: "switchChannel('/JOIN', '" + nameChanActive + "', " + id + ", $event);"}).removeClass("active new");

        $(element).removeAttr("ng-click").attr({id: "chan-0",
            name: channel}).addClass("active new");
        $(element).on("click", function() {
            Mobile.switchConv(0, $(element).html())
        });

        setMessage.getData({ q: "cmd", v: version, s: session, c: cmd + " " + channel, a: a++}).then(function (response) {
            $("#msg-input").val("");
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
        var link = $("#link_url").val(),
            libelle = $("#link_libelle").val(),
            input = $scope.msg;
        if (link === "") {
            $("#msg_input").val(input);
        } else if (libelle != "") {
            $("#msg_input").val(input + "[URL=" + link + "]" + libelle + "[/URL]");
        } else {
            $("#msg_input").val(input + "[URL]" + link + "[/URL]");
        }
        $("#msg_input").focus();
        $("#link_url").val("");
        $("#link_libelle").val("");
        Mobile.popover('about-user');
    };

    $scope.image = function () {
        var image = $('#image_libelle').val(),
            input = $scope.msg;
        if (image !== "") {
            $("#msg_input").val(input + "[IMG]" + image + "[/IMG]");
        } else {
            $("#msg_input").val(input);
        }
        $("#msg_input").focus();
        $('#image_libelle').val("");
        Mobile.popover('about-user');
    };

    $scope.away = function () {
        var message = $('#away').val();
        var texte = "/AWAY " + message;
        setMessage.getData({ q: "cmd", v: version, s: session, c: texte, a: a++ }).then(function (response) {
            $("#msg_input").focus();
            setMessage.doStatus(response.data);
            $scope.data = loadData.getData($scope);
        });

        Mobile.popover('about-user');
    };

    $scope.myNavSwipeRight = function () {
        if (!$('#slide-nav-left').hasClass('open-nav') && !$('#slide-nav-right').hasClass('open-nav')) {
            Mobile.slideNav('left');
        } else if (!$('#slide-nav-right').hasClass('open-nav') && $('#slide-nav-right').hasClass('open-nav')) {
            Mobile.slideNav('right');
        }
    };

    $scope.myNavSwipeLeft = function () {
        if ($('#slide-nav-left').hasClass('open-nav') && !$('#slide-nav-right').hasClass('open-nav')) {
            Mobile.slideNav('left');
        } else if (!$('#slide-nav-left').hasClass('open-nav') && !$('#slide-nav-right').hasClass('open-nav')) {
            Mobile.slideNav('right');
        }
    };

    $scope.myPopoverSwipeDown = function () {
        Mobile.popover('about-user');
    };
});
