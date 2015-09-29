'use strict';

/* global Robot */

angular.module('app')
  .provider('robot', function () {

    // Public API for configuration
    this.setUrl = function (url) {
      this.url = url;
    };

    // Method for instantiating
    this.$get = function () {
      var robot = window.r = new API.Robot();
      robot.connect(this.url);
      return robot;
    };
  });

angular.module('app')
  .config(function (robotProvider) {
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
    robotProvider.setUrl(rosUrl);
  });
