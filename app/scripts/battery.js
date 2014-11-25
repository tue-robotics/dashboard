'use strict';

var app = angular.module('app');

app.controller('BatteryCtrl', function ($scope, ros, $timeout) {

  var BATTERY_TIMEOUT = 2000; // ms

  $scope.battery = 0;
  $scope.batteryUnknown = false;

  var listener = new ROSLIB.Topic({
    ros : ros.ros,
    name : '/amigo/battery_percentage',
    messageType : 'std_msgs/Float32'
  });

  function resetBattery () {
    console.log('battery message timeout');
    $scope.$apply(function () {
      $scope.batteryUnknown = true;
      $scope.battery = 100;
    });
  }

  var resetBatteryLater = _.debounce(resetBattery, BATTERY_TIMEOUT);
  listener.subscribe(function(message) {
    var percent = message.data; // float32
    $scope.$apply(function () {
      $scope.batteryUnknown = false;
      $scope.battery = percent;
      resetBatteryLater();
    });
  });

  // change battery type based on value
  $scope.$watch('battery', function(){
    var type, value = $scope.battery;

    if ($scope.batteryUnknown) {
      type = 'info';
    } else if (value > 40) {
      type = 'success';
    } else if (value > 20) {
      type = 'warning';
    } else {
      type = 'danger';
    }
    $scope.batteryType = type;
  });
});
