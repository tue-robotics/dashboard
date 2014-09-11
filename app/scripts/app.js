'use strict';

//window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');

//require('./bower_components/bootstrap/dist/js/bootstrap.min.js');

//document.addEventListener('domready', function () {

  console.log('init');

  var remote = require('remote');
  var Menu = remote.require('menu');
  var MenuItem = remote.require('menu-item');

  var menu = new Menu();
  menu.append(new MenuItem({ label: 'MenuItem1', click: function() { console.log('item 1 clicked'); } }));
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

  document.getElementById('status-all').addEventListener('click', function (e) {
      menu.popup(remote.getCurrentWindow());
  });

  window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  }, false);

//});
