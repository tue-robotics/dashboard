'use strict';

var app = angular.module('app');

app.controller('StatusCtrl', function ($scope, ros, Hardware) {

  $scope.title = ros.rosbridge_url;

  // if no message arrived for 2000 ms,
  // set the ros status back to 'connecting'
  var checkConnection = _.debounce(function () {
    $scope.$apply(function () {
      $scope.rosStatus = 'connecting';
    });
  }, 2000);

  Hardware.subscribe(function () {
    $scope.rosStatus = 'ok';
    checkConnection();
  });

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

});
