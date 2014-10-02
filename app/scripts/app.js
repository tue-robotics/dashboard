'use strict';

var app = angular.module('app', []);

app.controller('MainCtrl', ['$scope', 'ros', function ($scope, ros) {
  $scope.title = '<%= appName %>';

  $scope.status = 'btn-primary';

  ros.on('connection', function () {
    $scope.rosStatus = 'connection';
  });

  ros.on('error', function () {
    $scope.rosStatus = 'error';
  });

  ros.on('close', function () {
    $scope.rosStatus = 'close';
  });


}]);

app.factory('ros', function ($rootScope) {
  var hostname = window.location.hostname || 'localhost';
  var rosUrl = 'ws://' + hostname + ':9090';

  var ros = new ROSLIB.Ros({
    url: rosUrl,
  });

  return {
    ros: ros,
    on: function (eventName, callback) {
      ros.addListener(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(ros, args);
        });
      });
    }
  };
});
