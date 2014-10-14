'use strict';

var app = angular.module('app');

app.factory('Hardware', function (ros, $rootScope) {
  var inTopic = new ROSLIB.Topic({
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
      };
    });
  }

  var outTopic = new ROSLIB.Topic({
    ros: ros.ros,
    name: '/amigo/dashboard_ctrlcmds',
    messageType: 'std_msgs/UInt8MultiArray',
  });

  var commands = {
    home:  21,
    start: 22,
    stop:  23,
    reset: 24,
  };

  /*
  |   Name  | Homeable | HomeableMandatory | Resetable |
  |---------|----------|-------------------|-----------|
  | Base    | no       | no                | yes       |
  | Spindle | yes      | yes               | yes       |
  | Arm     | yes      | no                | yes       |
  | Head    | no       | no                | no        |
  */
  var properties = {
    // Name     | Homeable | HomeableMandatory | Resetable |
    base:       [ false    , false             , true      ],
    spindle:    [ true     , true              , true      ],
    left_arm:   [ true     , false             , true      ],
    right_arm:  [ true     , false             , true      ],
    head:       [ false    , false             , false     ],
  };

  properties = _.mapValues(properties, function (v, k) {
    return {
      homeable:           v[0],
      homeable_mandatory: v[1],
      resetable:          v[2],
    };
  });

  return {
    subscribe: function (callback) {
      inTopic.subscribe(function(message) {
        var args = diagnosticMsgToStatus(message);
        $rootScope.$apply(function () {
          callback.call(this, args);
        });
      });
    },
    publish: function (i1, command) {
      var i2 = commands[command];
      console.log('sending this to the hardware:', i1, i2);

      var cmd = new ROSLIB.Message({
        data: [i1, i2],
      });

      outTopic.publish(cmd);
    },
    levels: {
      STALE:        0,
      IDLE:         1,
      OPERATIONAL:  2,
      HOMING:       3,
      ERROR:        4,
    },
    getActions: function () {

    }
  };
});
