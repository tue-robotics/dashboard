'use strict';

angular.module('app')

.directive('tueEbuttons', function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '\
      <button ng-repeat="ebutton in ebuttons" class="btn btn-xs btn-circle" \
          ng-class="ebutton.color" ng-attr-title="{{ebutton.name}}">\
        <span ng-class="ebutton.icon"></span>\
      </button>\
    ',

    controller: function ($scope, $attrs, ros) {
      // Constants
      var EBUTTONS_TIMEOUT = 2000; // ms
      var topic = 'ebutton_status';

      var levelColorMap = {
        0: 'success', // unlocked
        1: 'danger',  // locked
        2: 'warning', // unknown
        3: 'default', // unavailable
      };

      var nameIconMap = {
        'Wired': 'glyphicon glyphicon-ban-circle',
        'Wireless': 'glyphicon glyphicon-signal',
        'Endswitch': 'glyphicon glyphicon-resize-vertical',
        'Reset': 'glyphicon glyphicon-play-circle',
        'default': 'glyphicon glyphicon-question-sign'
      };

      // The state where the buttons will go on start and on timeout
      var DEFAULT_STATE = [
        {
          icon: nameIconMap['default'],
          class: levelColorMap[0],
        }
      ];

      var inTopic = new ROSLIB.Topic({
        ros: ros.ros,
        name: topic,
        messageType: 'diagnostic_msgs/DiagnosticArray',
        throttle_rate: 2,
      });

      $scope.ebuttons = DEFAULT_STATE;

      // only set when the state differs, less dom manipulation
      var old_ebuttons;
      function setEbuttons (ebuttons) {
        if (!angular.equals(old_ebuttons, ebuttons)) {
          old_ebuttons = ebuttons;
          $scope.ebuttons = ebuttons;
        }
      }

      function resetEbuttons () {
        console.log('ebuttons message timeout');
        $scope.$apply(function () {
          setEbuttons(DEFAULT_STATE);
        });
      }

      var resetEbuttonsLater = _.debounce(resetEbuttons, EBUTTONS_TIMEOUT);
      inTopic.subscribe(function (message) {
        var ebuttons = _.map(message.status, function (status) {
          return {
            name: status.name,
            color: levelToClass(status.level),
            icon: nameToIcon(status.name)
          };
        });
        resetEbuttonsLater();
        setEbuttons(ebuttons);
      });

      // Functions to convert between messages and models

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