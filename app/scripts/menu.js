'use strict';

var app = angular.module('app');

app.factory('menu', function ($rootScope) {

  // Load native UI library
  var gui = require('nw.gui');

  // Create an empty menu
  var menu = new gui.Menu();

  // Add some items

  var defaultActions = {
    'home':  {icon: 'icons/cogwheel.png'},
    'start': {icon: 'icons/small31.png'},
    'stop':  {icon: 'icons/no1.png'},
    'reset': {icon: 'icons/update.png'},
  };

  _.forEach(defaultActions, function (settings, action) {
    var options = {
      label: action,
    };
    _.extend(options, settings);
    menu.append(new gui.MenuItem(options));
  });

  return {
    popup: function (x, y) {
      // Popup as context menu
      menu.popup(100, 100);
    }
  };
});
