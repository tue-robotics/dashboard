'use strict';

var app = angular.module('app', ['ui.bootstrap']);

app.controller('MainCtrl', function ($scope, ros, Ping, Hardware) {
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

  var ping = new Ping(ros);
  ping.forward($scope);

  $scope.$on('ping:ok', function () {
    $scope.rosStatus = 'ok';
  });

  $scope.$on('ping:timeout', function () {
    $scope.rosStatus = 'timeout';
  });

  // battery
  $scope.battery = 50;
  $scope.batteryType = 'success';

  // hardware
  Hardware.subscribe(function (parts) {
    parts.forEach(function (part) {
      console.log(part);
    });
  })
});
