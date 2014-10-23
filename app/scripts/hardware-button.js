'use strict';

angular.module('app')

.controller('Controller', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}])

.directive('tueBattery', function() {
  return {
    //template: 'Name: {{customer.name}} Address: {{customer.address}}',
    restrict: 'E',
    templateUrl: '/tpl.html',
    controller: function () {

    }
  };
});
