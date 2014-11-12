'use strict';

describe('app.BatteryCtrl', function() {

  var scope;
  var ctrl;

  beforeEach(module('app'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('BatteryCtrl', {$scope: scope});
  }));

  describe('documentSaved property', function() {
    beforeEach(function() {
      scope.$apply(function () {
        scope.battery = 0;
      });
    });

    it('should watch for document.text changes', function() {
      expect(scope.batteryType).to.equal('danger');
    });
  });
});
