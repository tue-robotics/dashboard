'use strict';

var app = angular.module('app', ['ui.bootstrap']);

app.controller('MainCtrl', function ($scope, ros, Ping) {
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
    //console.log('ping status is ok', this, arguments);
    $scope.rosStatus = 'ok';
  });

  $scope.$on('ping:timeout', function () {
    //console.log('ping timeout', this, arguments);
    $scope.rosStatus = 'timeout';
  });

  // battery
  $scope.battery = 50;
  $scope.batteryType = 'success';
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

app.factory('Ping', function ($rootScope, $timeout) {

  var pingInterval = 2000; // ms. The time between pings
  var pingTimeout  = 500; // ms. If ros doesn't respond within this period of time, close the connection

  var defaultScope = $rootScope;
  // when forwarding events, prefix the event name
  var prefix = 'ping:';

  var Ping = function (ros) {
    this.ros = ros.ros;
    this.timeoutEventName = prefix + 'timeout';
    this.okEventName      = prefix + 'ok';
  };

  Ping.prototype.forward = function (scope) {
    var that = this;
    if (!scope) {
      scope = defaultScope;
    }

    // initialize the ping service to node_alive
    var pingClient = new ROSLIB.Service({
      ros : that.ros,
      name : '/get_alive_nodes',
      serviceType : 'node_alive/ListNodesAlive'
    });

    // this function gets called every pingInterval seconds
    var pingNodesAlive = function () {
      var request = new ROSLIB.ServiceRequest({});
      var start = new Date();

      setTimeout(function() {
        if (start !== -1) { // check if already received a response
          console.log(that.timeoutEventName, pingTimeout);
          $timeout(function () {
            scope.$broadcast(that.timeoutEventName, pingTimeout);
          });
        }
      }, pingTimeout);

      pingClient.callService(request, function(result) {
        var diff = new Date() - start;
        start = -1;

        console.log(that.okEventName, diff);
        $timeout(function () {
          scope.$broadcast(that.okEventName, diff);
        });
      });
    };

    var pingId;
    // start ping after the ros connection is started
    that.ros.addListener('connection', function() {
      setTimeout(that.pingNodesAlive, pingTimeout);
      pingId = setInterval(pingNodesAlive, pingInterval);
    });
    // and stop when the connection is closed
    that.ros.addListener('close', function() {
      clearInterval(pingId);
    });

    scope.$on('$destroy', function () {
      // clear the interval
    });
  };

  return Ping;
});
