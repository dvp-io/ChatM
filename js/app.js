angular.module('chatApp', ['ngStorage'])

.controller('chatCtrl', function ($scope, $http, $sce) {
    $scope.data = [];

    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    }

    getJSON($scope, $http);

    $scope.$watch(function(){
       addFunction();
    });

    var addFunction = function() {
        var users = document.getElementsByClassName("nomConnecte");
        for (user in users) {
            //console.log(users.item(user));
            if ( users.item(user) != null )
                users.item(user).setAttribute("onclick", "changeName(this); popover('about-user'); slideNav('right');");
        }
    }
});

var getJSON = function($scope, $http) {
    $http.get('ajax.json').
    success(function (data, status, headers, config) {
        $scope.data = data;

        addEventListener('load', function() {
            createPvsElement(data.pvs);
            listChannels(data.connectes);
        }, false);
    }).
    error(function (data, status, headers, config) {

    });
}

var createPvsElement = function(pvs) {
    var mpList = document.getElementById('msg-private-list');
    var listChild = mpList.children;
    angular.forEach(pvs, function(key, value) {
        var item = document.createElement("li");
        if ( inArray(key.id, listChild)  )
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
    console.log(users);
}



var inArray = function (needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}
