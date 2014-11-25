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

  var levels = {
    STALE:        0,
    IDLE:         1,
    OPERATIONAL:  2,
    HOMING:       3,
    ERROR:        4,
  };

  var hardware_ids = {
    'all':        0,
    'base':       1,
    'spindle':    2,
    'left_arm':   3,
    'right_arm':  4,
    'head':       5,
  };

  var default_status = _.mapValues(hardware_ids, function (value, name) {
    return {
      name: name,
      level: levels.STALE,
      homed: false,
    };
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
    hardware_status = _.indexBy(parts, 'name');

    // fill all missing hardware parts with 'idle'
    _.defaults(hardware_status, default_status);

    _.mapValues(hardware_status, function (part, name) {
      part.actions = getActions(name);
      return part;
    });

    return hardware_status;
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
  // transform the array of bools to an object
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

  function getActions(part) {
    var props = properties[part];
    if (!props) {
      return;
    }

    var status = hardware_status[part];
    var level = status ? status.level : -1;
    var homed = status ? status.homed : false;

    var actions = {};

    // only show the home action if homeable
    if (props.homeable) {
      actions.home = {
        enabled: level === levels.IDLE,
        warning: homed ?
          'This part was already homed, Are you sure you want to redo homing?' : false,
      };
    }

    // always show start action
    actions.start = {
      enabled: level === levels.IDLE && (homed || !props.homeable_mandatory),
      warning: props.homeable && !homed ?
        'This part is not yet homed, Are you sure you want to proceed?' : false,
    };

    // always show stop action
    actions.stop = {
      enabled: level === levels.HOMING || level === levels.OPERATIONAL,
    };

    // only show reset action if resetable
    if (props.resetable) {
      actions.reset = {
        enabled: level === levels.ERROR,
      };
    }

    return actions;
  }

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
    levels: levels,
    getActions: getActions,
  };
});
