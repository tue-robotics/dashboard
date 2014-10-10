'use strict';

var app = angular.module('app');

app.factory('menu', function ($rootScope) {

  // Load native UI library
  var gui = require('nw.gui');

  // Create an empty menu
  var menu = new gui.Menu();

  // Add some items

  var defaultActions = {
    'home': true,
    'start': true,
    'stop': true,
    'reset': true,
  };

  _.forEach(defaultActions, function (v, action) {
    console.log('adding action', action);
    menu.append(new gui.MenuItem({
      label: action
    }));
  });

  return {
    popup: function (x, y) {
      // Popup as context menu
      menu.popup(10, 10);


    }
  };
});
