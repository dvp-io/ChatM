angular.module('chatApp', ['angular-gestures'])

.controller('chatCtrl', function ($scope, $http, $sce, $interval) {
    $scope.data = [];

    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    }

    var i = 1;
    $interval(function() {
        getJSON($scope, $http, i);
        i++;
    }, 1000, 10);

    /*$scope.$watch(function(){
        addFunction();
    });*/

    $scope.myNavSwipeRight = function() {
        if ( !hasClass(document.getElementById('slide-nav-left'), 'open-nav')
            && !hasClass(document.getElementById('slide-nav-right'), 'open-nav'))
            slideNav('left');
        else if ( !hasClass(document.getElementById('slide-nav-left'), 'open-nav')
            && hasClass(document.getElementById('slide-nav-right'), 'open-nav'))
            slideNav('right');
    }

    $scope.myNavSwipeLeft = function() {
        if ( hasClass(document.getElementById('slide-nav-left'), 'open-nav')
            && !hasClass(document.getElementById('slide-nav-right'), 'open-nav'))
            slideNav('left');
        else if ( !hasClass(document.getElementById('slide-nav-left'), 'open-nav')
            && !hasClass(document.getElementById('slide-nav-right'), 'open-nav'))
            slideNav('right');
    }

    $scope.myPopoverSwipeDown = function( ) {
        popover('about-user');
    }
});

var addFunction = function() {
    var users = document.getElementsByClassName("nomConnecte");
    for (user in users) {
        if ( users.item(user) != null )
            users.item(user).setAttribute("onclick", "changeName(this); popover('about-user'); slideNav('right');");
    }
}

var getJSON = function($scope, $http, i) {
    $http.get('json/ajax' + i + '.json').
    success(function (data, status, headers, config) {
        $scope.data.salon = data.salon;
        $scope.data.nomSalon = data.nomSalon;
        $scope.data.connectes = data.connectes;
        $scope.data.pvs = data.pvs;

        $scope.$watch('$viewContentLoaded', function(event) {
            if ( data.connectes != "" )
                createUsersList(data.connectes);
            createLineChannel(data.salon);
            if ( data.pvs.length > 0 )
                createPvsElement(data.pvs);
        });

    }).
    error(function (data, status, headers, config) {

    });
}

var createUsersList = function(users) {
    var list = document.getElementById('users-list');
    list.innerHTML = users;

    addFunction();
}

var createLineChannel = function(channel) {
    var conv = document.getElementById('conversation');
    var item = document.createElement('div');
    item.setAttribute('class', 'line');
    item.innerHTML = channel;
    conv.appendChild(item);
}

var createPvsElement = function(pvs) {
    var mpList = document.getElementById('msg-private-list');
    var listChild = mpList.children;
    //console.log(listChild);
    angular.forEach(pvs, function(key, value) {
        var item = document.createElement("li");
        if ( !inArray(key.id, listChild)  )
        {
            item.setAttribute("class", "item new");
            item.setAttribute("id", key.id);
            item.appendChild(document.createTextNode(key.pseudo));
            mpList.appendChild(item);
        } else {
            item.setAttribute("class", "new");
        }
    });
}

var listChannels = function( users ) {
    //console.log(users);
}
