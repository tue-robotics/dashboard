'use strict';

angular.module('app')

.directive('tueRunstop', function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '<button class="btn btn-xs btn-circle" ng-class="class" ng-transclude></button>',

    scope: {
      type: '=',
    },
    controller: function ($scope, $attrs, ros) {
      var topic;
      if ($attrs.type === 'wireless') {
        topic = '/amigo/emergency_switch';
      } else {
        topic = '/amigo/runstop';
      }

      var inTopic = new ROSLIB.Topic({
        ros: ros.ros,
        name: topic,
        messageType: 'std_msgs/Bool',
        throttle_rate: 2,
      });

      function setEnabled (enabled) {
        $scope.$apply(function () {
          $scope.enabled = enabled;
        });
      }

      var unsetEnabled = _.debounce(function () {
        setEnabled(undefined);
      }, 2000);

      inTopic.subscribe(function(message) {
        setEnabled(message.data);
        unsetEnabled();
      });

      $scope.$watch('enabled', function(enabled) {
        if (typeof enabled === 'undefined') {
          $scope.class = 'btn-default';
        } else if (enabled) {
          $scope.class = 'btn-danger';
        } else {
          $scope.class = 'btn-success';
        }
      });
    }
  };
});
