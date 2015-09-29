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
      return robot;
    };
  });
