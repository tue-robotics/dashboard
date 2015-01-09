'use strict';

angular.module('app')

.directive('tueEbuttons', function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '\
      <button ng-repeat="ebutton in ebuttons" class="btn btn-xs btn-circle" ng-class="ebutton.color">\
        <span ng-class="ebutton.icon"></span>\
      </button>\
    ',

    controller: function ($scope, $attrs, ros) {
      var topic = '/amigo/ebutton_status';

      var inTopic = new ROSLIB.Topic({
        ros: ros.ros,
        name: topic,
        messageType: 'diagnostic_msgs/DiagnosticArray',
        throttle_rate: 2,
      });

      var levelColorMap = {
        0: 'default',
        1: 'info',
        2: 'success',
        3: 'default',
      };

      var nameIconMap = {
        'Wired': 'glyphicon glyphicon-ban-circle',
        'Wireless': 'glyphicon glyphicon-signal',
        'default': 'question-sign'
      };

      $scope.ebuttons = [];

      inTopic.subscribe(function(message) {
        var ebuttons = _.map(message.status, function (status) {
          return {
            color: levelToClass(status.level),
            icon: nameToIcon(status.name)
          };
        });

        $scope.ebuttons = ebuttons;
      });

      function levelToClass(level) {
        return levelColorMap[level] ? 'btn-' + levelColorMap[level] : '';
      }

      function nameToIcon(name) {
        if (nameIconMap[name]) {
          return nameIconMap[name];
        } else {
          return nameIconMap['default'];
        }
      }
    }
  };
});
