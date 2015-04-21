angular.module('chatApp', [])

.controller('chatCtrl', function ($scope, $http, $sce, $timeout) {
    $scope.data = [];

    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    }

    $http.get('ajax.json').
    success(function (data, status, headers, config) {
        //console.log(data);
        $scope.data = data;
    }).
    error(function (data, status, headers, config) {

    });

    $scope.$watch(function(){
        addFunction();
    });

    var addFunction = function() {
        var users = document.getElementsByClassName("nomConnecte");
        for (i in users) {
            //console.log(users.item(i));
            users.item(i).setAttribute("onclick", "changeName(this); popover('about-user'); slideNav('right');");
        }
    }

});
