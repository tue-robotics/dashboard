'use strict';

var app = angular.module('app');

app.factory('menu', function () {

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

  var callbacks = [];

  var onClick = function (action) {
    _.forEach(callbacks, function (cb) {
      cb(action);
    });
    callbacks = [];
  };

  _.forEach(defaultActions, function (settings, action) {
    var options = {
      label: action,
      click: function () {
        onClick.call(this, action);
      },
    };
    _.extend(options, settings);
    menu.append(new gui.MenuItem(options));
  });

  return {
    popup: function (x, y, callback) {
      // Popup as context menu
      callbacks = [callback];
      menu.popup(100, 100);
    },
  };
});
