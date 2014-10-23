'use strict';

angular.module('app')

.controller('Controller', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}])

.directive('tueHardwareButton', function() {
  return {
    //template: 'Name: {{customer.name}} Address: {{customer.address}}',
    restrict: 'E',
    transclude: true,
    templateUrl: '/hardware-button.html',
    scope: {
      status: '='
    },
    controller: function ($scope, $attrs) {
      console.log($scope);
      console.log($attrs);
      $scope.asdf = 'fdsa';
    }
  };
});
