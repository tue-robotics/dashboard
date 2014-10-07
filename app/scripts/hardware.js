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

  setTimeout(function () {
    topic.unsubscribe();
  }, 500);

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
    }
  };
});
