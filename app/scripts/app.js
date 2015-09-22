'use strict';

var app = angular.module('app', ['ui.bootstrap', 'angularSpinner']);

app.controller('MainCtrl', function ($scope, robot, menu) {

  // battery

  $scope.battery = 50;
  $scope.batteryType = 'success';

  // hardware

  var levelColorMap = {
    STALE:        'default',
    IDLE:         'info',
    OPERATIONAL:  'success',
    HOMING:       'warning',
    ERROR:        'danger',
  };

  var levelMap = _.invert(API.Hardware.levels);

  robot.hardware.on('status', function (status) {
    $scope.$apply(function () {

      var parts = _.mapValues(status, function (props) {
        var level = _.at(levelMap, props.level);
        var color = levelColorMap[level];
        props.class = 'btn-' + color;
        return props;
      });

      $scope.hardware = parts;

    });
  });

  var sendCommand = function(part, command) {
    robot.hardware.send_command(part, command);
  };
  $scope.sendCommand = sendCommand;

  var actionIcons = {
    'home':  {icon: 'icons/cogwheel.png', glyphicon: 'cog'},
    'start': {icon: 'icons/small31.png',  glyphicon: 'play'},
    'stop':  {icon: 'icons/no1.png',      glyphicon: 'stop'},
    'reset': {icon: 'icons/update.png',   glyphicon: 'refresh'},
  };

  // native context menu for selecting actions
  $scope.showMenu = function (e, part) {
    var actions = robot.hardware.status[part].actions;

    // merge the action icons in only when they are defined
    actions = _.mapValues(actions, function (props, action) {
        return _.merge(_.clone(props), actionIcons[action]);
    });

    menu.popup(e.x, e.y, actions, function (command) {
      var warning = actions[command].warning;
      if (warning && !window.confirm(warning)) {
        return;
      }
      sendCommand(part, command);
    });
  };

  $scope.showDevTools = function () {
    console.log('showDevtools');
    require('nw.gui').Window.get().showDevTools();
  };

  $scope.reload = function () {
    location.reload();
  };
});
