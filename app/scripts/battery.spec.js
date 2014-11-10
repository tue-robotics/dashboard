'use strict';

describe('app.BatteryCtrl module', function() {
  beforeEach(module('myApp.BatteryCtrl'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
