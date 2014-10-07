'use strict';

var app = angular.module('app');

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
