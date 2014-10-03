'use strict';

var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, ros, Ping) {
  $scope.title = '<%= appName %>';

  $scope.status = 'btn-primary';

  // forward all ros events to the current scope
  ros.forward(['connection', 'error', 'close'], $scope);

  $scope.$on('ros:connection', function (ev, data) {
    $scope.rosStatus = 'connection';
  })

  $scope.$on('ros:error', function () {
    $scope.rosStatus = 'error';
  });

  $scope.$on('ros:close', function () {
    $scope.rosStatus = 'close';
  });
});

app.factory('ros', function ($rootScope, $timeout) {
  var defaultScope = $rootScope;
  // when forwarding events, prefix the event name
  var prefix = 'ros:';

  var hostname = window.location.hostname || 'localhost';
  var rosUrl = 'ws://' + hostname + ':9090';

  var ros = new ROSLIB.Ros({
    url: rosUrl,
  });

  var asyncAngularify = function (that, callback) {
    return callback ? function () {
      var args = arguments;
      $timeout(function () {
        callback.apply(that, args);
      }, 0);
    } : angular.noop;
  };

  return {
    ros: ros,
    on: function (eventName, callback) {
      ros.addListener(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(ros, args);
        });
      });
    },
    forward: function (events, scope) {
      if (!Array.isArray(events)) {
        events = [events];
      }
      if (!scope) {
        scope = defaultScope;
      }
      events.forEach(function (eventName) {
        var prefixedEvent = prefix + eventName;
        var forwardBroadcast = asyncAngularify(ros, function (data) {
          scope.$broadcast(prefixedEvent, data);
        });
        scope.$on('$destroy', function () {
          ros.removeListener(eventName, forwardBroadcast);
        });
        ros.on(eventName, forwardBroadcast);
      });
    }
  };
});

app.factory('Ping', function (ros) {

});
