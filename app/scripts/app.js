'use strict';

var app = angular.module('app', ['ui.bootstrap', 'angularSpinner']);

app.controller('MainCtrl', function ($scope, ros, Hardware, menu) {
  $scope.title = '<%= appName %>';

  $scope.status = 'btn-primary';

  // forward all ros events to the current scope
  ros.forward(['connection', 'error', 'close'], $scope);

  $scope.$on('ros:connection', function (ev, data) {
    $scope.rosStatus = 'connecting';
  })

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
  }, 2000)

  Hardware.subscribe(function (parts) {

    var parts = _.map(parts, function (part) {
      var level = _.at(levelMap, part.level);
      var color = levelColorMap[level];
      part.class = 'btn-' + color;
      return part;
    });

    parts = _.indexBy(parts, 'name');


    throttleLog(parts);

    $scope.rosStatus = 'ok';
    rosTimeout();

    $scope.hardware = parts;
  });

  // menu

  $scope.showMenu = function (e) {
    menu.popup(e.x, e.y);
  };

});
