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

        addEventListener('load', load, false);

        function load(){
            var mpList = document.getElementById('msg-private-list');
            var listChild = mpList.children;
            angular.forEach(data.pvs, function(key, value) {
                if ( inArray(key.id, listChild)  )
                {
                    var item = document.createElement("li");
                    item.setAttribute("class", "item");
                    item.appendChild(document.createTextNode(key.pseudo));
                    mpList.appendChild(item);
                }
            });
        }
    }).
    error(function (data, status, headers, config) {

    });
}

var inArray = function (needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}
