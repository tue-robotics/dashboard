'use strict';

angular.module('app')

.directive('tueRunstop', function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '<button class="btn btn-xs btn-circle" ng-transclude></button>',

    scope: {
    },
    controller: function ($scope, ros) {
      console.log('in the controller');
    }
  };
});
