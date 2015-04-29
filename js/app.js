var app = angular.module('chatApp', ['angular-gestures', 'ngRoute'], setPostHeader);

var firstConnexion = 0;
var version = "2.1.0";
var optionsChat = "";
var session, lastData;

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

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
    }).when('/chat', {
        templateUrl: 'chat.html',
        controller: 'ChatCtrl'
    }).otherwise({
        redirectTo: '/login'
    });
}]);

app.service('sharedProperties', function () {
    var data = [];
    var session = [];
    var version = "2.1.0";
    var etat = 0;

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
        }
    };
});

app.factory('setMessage', function ($http, sharedProperties, $location) {
    var optionsChat = "";

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
                cache: false,
                url: 'http://chat.dvp.io/ajax.php',
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
            }
            else if (data.etat === 2) {
                sharedProperties.setSession(data.session);
            }
            if (firstConnexion === 0) {
                popover('login');
                $location.path('/chat');
            }
        },

        userConnect : function () {
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

            return { q: "conn", v: sharedProperties.getVersion(), identifiant: pseudo, motdepasse: password, mode: mode,
                decalageHoraire: new Date().getTimezoneOffset(), options: optionsChat, salon: channel };
        }
    };
    return setMessage;
});

app.factory('loadData', function (sharedProperties, $timeout) {
    var addFunction = function () {
        var users = document.getElementsByClassName("nomConnecte");
        for (user in users) {
            if (users.item(user) !== null) {
                users.item(user).setAttribute("ng-click", "changeName(this); popover('about-user'); slideNav('right'); return false;");
            }
        }
    };

    var createUsersList = function (users) {
        var list = document.getElementById('users-list');
        list.innerHTML = users;

        addFunction();
    };

    var createLineChannel = function (channel) {
        var conv = document.getElementById('conv-0');
        var item = document.createElement('div');
        item.setAttribute('class', 'line');
        item.innerHTML = channel;
        conv.appendChild(item);
    };

    var createPvsElement = function (pvs) {
        var mpList = document.getElementById('msg-private-list');
        var listChild = mpList.children;
        //console.log(listChild);
        angular.forEach(pvs, function (key, value) {
            var item = document.createElement("li");
            if (!inArray("pvs-" + key.id, listChild)) {
                // ici on crée l'onglet de la conv dans le menu de gauche
                item.setAttribute("class", "item new");
                item.setAttribute("id", "pvs-" + key.id);
                item.setAttribute("onclick", "switchConv(" + key.id + ", '" + key.pseudo + "');");
                item.appendChild(document.createTextNode(key.pseudo));
                mpList.appendChild(item);

                // ici on crée la div qui va accueillir la conv pvs
                var parent = document.getElementById('conversations');
                var conv = document.createElement("div");
                conv.setAttribute("id", "conv-" + key.id);
                conv.setAttribute("class", "conv");
                parent.appendChild(conv);
            } else {
                item.setAttribute("class", "new");
            }

            addMsgPvs(key.id, key.html);
        });
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

    var addMsgPvs = function (id, html) {
        var conv = document.getElementById('conv-' + id);
        var item = document.createElement('div');
        item.setAttribute('class', 'line');
        item.innerHTML = html;
        conv.appendChild(item);
    };

    var loadData = {
        getData: function ($scope) {
            if (sharedProperties.getData() !== undefined) {
                if (sharedProperties.getData().nomSalon !== undefined) {
                    switch (sharedProperties.getData().nomSalon) {
                        case "Développement Applicatif" :
                            $scope.data.nomSalon = "Dev. App.";
                            break;
                        case "Développement Web" :
                            $scope.data.nomSalon = "Dev. Web";
                            break;
                        default :
                            $scope.data.nomSalon = sharedProperties.getData().nomSalon;
                            break;
                    }
                }

                if (sharedProperties.getData().connectes !== "") {
                    createUsersList(sharedProperties.getData().connectes);
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
                        var div = document.getElementById('list-smileys-perso');
                        var list = div.getElementsByTagName("a");
                        for (i = 0; i < list.length; i++) {
                            list[i].setAttribute("onclick", "return false;");
                            var link = list[i].getElementsByTagName('img')[0].getAttribute("src");
                            list[i].getElementsByTagName('img')[0].setAttribute("src", "http://chat.developpez.com/" + link);
                        }
                    }

                    checkNewPvs();
                });
            }
            return $scope.data;
        }
    };
    return loadData;
});

app.controller('LoginCtrl', function (sharedProperties, setMessage, loadData, $scope) {
    $scope.ngUserConnect = function () {
        var json = setMessage.userConnect();
        if (json !== undefined) {
            setMessage.getData(json).then(function (response) {
                setMessage.doStatus(response.data);
                firstConnexion = 1;
            });
        }
    };
});

app.controller('ChatCtrl', function (sharedProperties, setMessage, loadData, $scope, $sce, $interval) {
    $scope.data = [];

    $scope.data = loadData.getData($scope);

    var interval = $interval(function () {
        if (sharedProperties.getEtat() < 1) {
            stopInterval();
        } else {
            setMessage.getData({q: "act", v: sharedProperties.getVersion(), s: sharedProperties.getSession(), a: 0}).then(function (response) {
                setMessage.doStatus(response.data);
                $scope.data = loadData.getData($scope);
            });
        }
    }, 3000);

    var stopInterval = function() {
        $interval.cancel(interval);
    };

    $scope.switchConv = function (id, pseudo) {
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

    $scope.toTrustedHTML = function (html) {
        return $sce.trustAsHtml(html);
    };

    $scope.myNavSwipeRight = function () {
        if (!hasClass(document.getElementById('slide-nav-left'), 'open-nav') && !hasClass(document.getElementById('slide-nav-right'), 'open-nav')) {
            slideNav('left');
        } else if (!hasClass(document.getElementById('slide-nav-left'), 'open-nav') && hasClass(document.getElementById('slide-nav-right'), 'open-nav')) {
            slideNav('right');
        }
    };

    $scope.myNavSwipeLeft = function () {
        if (hasClass(document.getElementById('slide-nav-left'), 'open-nav') && !hasClass(document.getElementById('slide-nav-right'), 'open-nav')) {
            slideNav('left');
        } else if (!hasClass(document.getElementById('slide-nav-left'), 'open-nav') && !hasClass(document.getElementById('slide-nav-right'), 'open-nav')) {
            slideNav('right');
        }
    };

    $scope.myPopoverSwipeDown = function () {
        popover('about-user');
    };
});
