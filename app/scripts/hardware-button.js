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
    restrict: 'E',
    transclude: true,
    templateUrl: '/hardware-button.html',
    scope: {
      status: '='
    },
    controller: function ($scope, $attrs) {
      $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
      };
    }
  };
});
