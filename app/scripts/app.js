'use strict';

var app = angular.module('app', ['ui.bootstrap', 'angularSpinner']);

app.controller('MainCtrl', function ($scope, ros, Hardware, menu) {
  $scope.title = '<%= appName %>';

  $scope.status = 'btn-primary';

  // forward all ros events to the current scope
  ros.forward(['connection', 'error', 'close'], $scope);

  $scope.$on('ros:connection', function () {
    console.log('ros:connection');
    $scope.rosStatus = 'connecting';
  });

  $scope.$on('ros:error', function () {
    console.log('ros:error');
    $scope.rosStatus = 'error';
  });

  $scope.$on('ros:close', function () {
    console.log('ros:close');
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

  var sendCommand = function(part, command) {
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
    var actions = Hardware.getActions(part);

    // merge the action icons in only when they are defined
    actions = _.mapValues(actions, function (props, action) {
        return _.merge(_.clone(props), actionIcons[action]);
    });

    menu.popup(e.x, e.y, actions, function (command) {
      var warning = actions[command].warning;
      if (warning && !confirm(warning)) {
        return;
      }
      sendCommand(part, command);
    });
  };

  $scope.showDevTools = function () {
    console.log('showDevtools');
    require('nw.gui').Window.get().showDevTools();
  };

  $scope.reload = function () {
    location.reload();
  }
});
