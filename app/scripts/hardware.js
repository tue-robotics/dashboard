'use strict';

var app = angular.module('app');

app.factory('Hardware', function (ros, $rootScope) {
  var inTopic = new ROSLIB.Topic({
    ros: ros.ros,
    name: '/amigo/hardware_status',
    messageType: 'diagnostic_msgs/DiagnosticArray',
    throttle_rate: 2,
  });

  var outTopic = new ROSLIB.Topic({
    ros: ros.ros,
    name: '/amigo/dashboard_ctrlcmds',
    messageType: 'std_msgs/UInt8MultiArray',
  });

  // save the last hardware status for getting the possible actions
  var hardware_status = {};
  function diagnosticMsgToStatus(message) {
    var parts = message.status.map(function (part) {
      return {
        name: part.name,
        level: part.level,
        homed: part.message === 'homed',
      };
    });

    return hardware_status = _.indexBy(parts, 'name');
  }

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
    all:        [ true     , false             , true      ],
    base:       [ false    , false             , true      ],
    spindle:    [ true     , true              , true      ],
    left_arm:   [ true     , false             , true      ],
    right_arm:  [ true     , false             , true      ],
    head:       [ false    , false             , false     ],
  };
  properties = _.mapValues(properties, function (v) {
    return {
      homeable:           v[0],
      homeable_mandatory: v[1],
      resetable:          v[2],
    };
  });

  // define how the actions map to hardware commands
  var commands = {
    home:  21,
    start: 22,
    stop:  23,
    reset: 24,
  };

  var hardware_ids = {
    "all":        0,
    "base":       1,
    "spindle":    2,
    "left_arm":   3,
    "right_arm":  4,
    "head":       5,
  };

  return {
    subscribe: function (callback) {
      inTopic.subscribe(function(message) {
        var args = diagnosticMsgToStatus(message);
        $rootScope.$apply(function () {
          callback.call(this, args);
        });
      });
    },
    publish: function (part, command) {
      var i1 = hardware_ids[part];
      var i2 = commands[command];
      console.log('hardware command: %s %s (%i, %i)', command, part, i1, i2);

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
    getActions: function (part) {
      var properties = properties[part]
      if (!properties) {
        return {};
      }

      console.log(properties);
    }
  };
});
