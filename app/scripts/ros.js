'use strict';

var app = angular.module('app');

app.factory('rosbridge_url', function () {
  var default_hostname = 'localhost';
  var hostname;
  // inside node-webkit
  if (typeof process === 'object') {
    var gui = require('nw.gui');
    var args = gui.App.argv;
    if (args.length > 0) {
      hostname = args[0];
    } else {
      hostname = default_hostname;
    }
  } else {
    hostname = window.location.hostname || default_hostname;
  }

  var rosUrl = 'ws://' + hostname + ':9090';
  console.log('rosbridge_url:', rosUrl);
  return rosUrl;
});

app.factory('ros', function ($rootScope, $timeout, rosbridge_url) {
  var defaultScope = $rootScope;
  // when forwarding events, prefix the event name
  var prefix = 'ros:';

  var ros = new ROSLIB.Ros({
    url: rosbridge_url,
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
