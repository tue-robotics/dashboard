'use strict';

var app = angular.module('app');

/**
 * Status overview:
 * - connecting - will listen for hardware messages to go to ok
 * - ok         -
 * - error      -
 * - closed     - in this state, we will try to reconnect each 5 secs
 */
app.controller('StatusCtrl', function ($scope, robot) {

  $scope.title = robot.ros.socket.url;

  robot.on('status', function (status) {
    $scope.rosStatus = status;
  });

});
