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

    parts = _.map(parts, function (part) {
      var level = _.at(levelMap, part.level);
      var color = levelColorMap[level];
      part.class = 'btn-' + color;
      return part;
    });
    parts = _.indexBy(parts, 'name');

    $scope.rosStatus = 'ok';
    rosTimeout();

    $scope.hardware = parts;

    throttleLog(parts);
  });



  var sendCommand = function(part, command) {
    Hardware.publish(part, command);
  };

  $scope.sendCommand = sendCommand;

  // native context menu

  var actions = {
    'home':  {icon: 'icons/cogwheel.png'},
    'start': {icon: 'icons/small31.png'},
    'stop':  {icon: 'icons/no1.png'},
    'reset': {icon: 'icons/update.png'},
  };

  $scope.showMenu = function (e, part) {
    menu.popup(e.x, e.y, actions, function (command) {

    });
  };

  // bootstrap dropdown
  $scope.actions = actions;
});
