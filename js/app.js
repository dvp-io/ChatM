angular.module('chatApp', [])

.controller('chatCtrl', function ($scope, $http, $sce) {
    $scope.data = [];

    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    }

    $http.get('../ajax.json').
    success(function (data, status, headers, config) {
        console.log(data);
        $scope.data = data;
    }).
    error(function (data, status, headers, config) {

    });
});
