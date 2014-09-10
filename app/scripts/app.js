'use strict';

var app = angular.module('app', []);

app.controller('MainCtrl', ['$scope', function ($scope) {
  $scope.title = 'Dashboard';
  $scope.greeting = 'Hola!';
}]);
