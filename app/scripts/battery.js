'use strict';

var app = angular.module('app');

app.controller('BatteryCtrl', function ($scope, ros) {

  var listener = new ROSLIB.Topic({
    ros : ros.ros,
    name : '/amigo/battery_percentage',
    messageType : 'std_msgs/Float32'
  });

  listener.subscribe(function(message) {
    var percent = message.data; // float32
    set_battery(percent);
  });

  function set_battery(percent) {
    $scope.$apply(function () {
      $scope.battery = percent;
    })
  }

  $scope.$watch('battery', function(){
    var type, value = $scope.battery;
    if (value > 40) {
      type = 'success';
    } else if (value > 20) {
      type = 'warning';
    } else {
      type = 'danger';
    }
    $scope.batteryType = type;
  });
});
