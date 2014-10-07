'use strict';

var app = angular.module('app');

app.factory('Hardware', function (ros, $rootScope) {
  var topic = new ROSLIB.Topic({
    ros: ros.ros,
    name: '/amigo/hardware_status',
    messageType: 'diagnostic_msgs/DiagnosticArray',
    throttle_rate: 2,
  });

  function diagnosticMsgToStatus(message) {
    return message.status.map(function (part) {
      return {
        name: part.name,
        level: part.level,
        homed: part.message === 'homed',
      }
    });
  }

  return {
    subscribe: function (callback) {
      topic.subscribe(function(message) {
        var args = diagnosticMsgToStatus(message);
        $rootScope.$apply(function () {
          callback.call(this, args);
        });
      });
    },
    levels: {
      STALE:        0,
      IDLE:         1,
      OPERATIONAL:  2,
      HOMING:       3,
      ERROR:        4,
    },
    commands: {
      HOMING_CMD: 21,
      START_CMD:  22,
      STOP_CMD:   23,
      RESET_CMD:  24,
    },
  };
});
