var app = angular.module('chatApp', ['angular-gestures']);

app.controller('chatCtrl', function ($scope, $http, $sce, $interval) {
    $scope.data = [];

    $scope.toTrustedHTML = function (html) {
        return $sce.trustAsHtml(html);
    };

    var i = 1;
    getJSON($scope, $http, i);
    $interval(function () {
        i++;
        getJSON($scope, $http, i);
    }, 1000, 10);

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

var addFunction = function () {
    var users = document.getElementsByClassName("nomConnecte");
    for (user in users) {
        if (users.item(user) !== null) {
            users.item(user).setAttribute("onclick", "changeName(this); popover('about-user'); slideNav('right');");
        }
    }
};

var getJSON = function ($scope, $http, i) {

    //console.log("json " + i);

    $http.get('json/ajax' + i + '.json').success(function (data, status, headers, config) {
        if (data.nomSalon !== undefined) {
            $scope.data.nomSalon = data.nomSalon;
        }

        if (data.connectes !== "") {
            createUsersList(data.connectes);
        }

        $scope.$watch('$viewContentLoaded', function (event) {
            createLineChannel(data.salon);
            if (data.pvs.length > 0) {
                createPvsElement(data.pvs, $scope);
            }

            checkNewPvs();
        });

    }).error(function (data, status, headers, config) { });
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

var createPvsElement = function (pvs, $scope) {
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

var switchConv = function (id, pseudo) {
    var parent = document.getElementById("conversations");
    var convActive = parent.getElementsByClassName("open-conv");
    convActive[0].classList.remove("open-conv");

    document.getElementById("conv-" + id).classList.add("open-conv");
    document.getElementById('header-title').innerHTML = pseudo;

    // on lui enlève la classe new puisqu'on a switché sur la conv
    var pvs = document.getElementById("pvs-" + id);
    pvs.classList.remove("new");

    checkNewPvs();
    slideNav('left');
};
