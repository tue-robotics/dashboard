'use strict';

var app = angular.module('app');

app.factory('menu', function () {

  return {
    popup: function (x, y, actions, callback) {
      // Load native UI library
      var gui = require('nw.gui');

      // Create an empty menu
      var menu = new gui.Menu();

      // Add some items
      var actions = {
        'home':  {icon: 'icons/cogwheel.png'},
        'start': {icon: 'icons/small31.png'},
        'stop':  {icon: 'icons/no1.png'},
        'reset': {icon: 'icons/update.png'},
      };

      _.forEach(actions, function (settings, action) {
        var options = {
          label: action,
          click: function () {
            callback.call(this, action);
          },
        };
        _.extend(options, settings);
        menu.append(new gui.MenuItem(options));
      });

      // Popup as context menu
      menu.popup(x, y);
    },
  };
});
