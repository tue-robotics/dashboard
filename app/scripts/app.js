'use strict';

var app = angular.module('app', ['ui.bootstrap', 'angularSpinner']);

app.controller('MainCtrl', function ($scope, ros, Hardware, menu) {
  $scope.title = '<%= appName %>';

  $scope.status = 'btn-primary';

  // forward all ros events to the current scope
  ros.forward(['connection', 'error', 'close'], $scope);

  $scope.$on('ros:connection', function () {
    $scope.rosStatus = 'connecting';
  });

  $scope.$on('ros:error', function () {
    $scope.rosStatus = 'error';
  });

  $scope.$on('ros:close', function () {
    $scope.rosStatus = 'closed';
  });

  // battery

  $scope.battery = 50;
  $scope.batteryType = 'success';

  // hardware

  var levelColorMap = {
    STALE:        'default',
    IDLE:         'info',
    OPERATIONAL:  'success',
    HOMING:       'warning',
    ERROR:        'danger',
  };

  var levelMap = _.invert(Hardware.levels);

  var throttleLog = _.throttle(function () {
      console.log.apply(console, arguments);
    }, 5000);

  var rosTimeout = _.debounce(function () {
    $scope.$apply(function () {
      $scope.rosStatus = 'connecting';
    });
  }, 2000);

  Hardware.subscribe(function (parts) {

    // determine the class by color
    parts = _.mapValues(parts, function (props) {

      var level = _.at(levelMap, props.level);
      var color = levelColorMap[level];
      props.class = 'btn-' + color;
      return props;
    });

    $scope.rosStatus = 'ok';
    rosTimeout();

    $scope.hardware = parts;

    //throttleLog(parts);
  });

  var actions = {};

  var sendCommand = function(part, command) {
    var warning = actions[command].warning;
    if (warning && !confirm(warning)) {
      return;
    }
    Hardware.publish(part, command);
  };
  $scope.sendCommand = sendCommand;

  var actionIcons = {
    'home':  {icon: 'icons/cogwheel.png', glyphicon: 'cog'},
    'start': {icon: 'icons/small31.png',  glyphicon: 'play'},
    'stop':  {icon: 'icons/no1.png',      glyphicon: 'stop'},
    'reset': {icon: 'icons/update.png',   glyphicon: 'refresh'},
  };

  // native context menu for selecting actions
  $scope.showMenu = function (e, part) {
    //var actions = Hardware.getActions(part);
    actions = Hardware.getActions(part);

    // merge the action icons in only when they are defined
    actions = _.mapValues(actions, function (props, action) {
        return _.merge(_.clone(props), actionIcons[action]);
    });

    menu.popup(e.x, e.y, actions, function (command) {
      sendCommand(part, command);
    });
  };

  // bootstrap dropdown for selecting actions
  $scope.toggled = function (open, part) {
    if (open) {
      actions = Hardware.getActions(part);

      // merge the action icons in only when they are defined
      actions = _.mapValues(actions, function (props, action) {
          return _.merge(_.clone(props), actionIcons[action]);
      });
      $scope.actions = actions;
    }
  };
});
