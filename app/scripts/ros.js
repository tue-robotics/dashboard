'use strict';

var app = angular.module('app');

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
