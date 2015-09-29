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

  if (typeof process === 'object') {
    var gui = require('nw.gui');
    $scope.title = 'dashboard v' + gui.App.manifest.version + ' @ ' + robot.url;
  } else {
    $scope.title = 'dashboard @ ' + robot.url;
  }

  robot.on('status', function (status) {
    $scope.$apply(function () {
      $scope.rosStatus = status;
    });
  });

});
