'use strict';

describe('Service: countrylist', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var countrylist;
  beforeEach(inject(function (_countrylist_) {
    countrylist = _countrylist_;
  }));

  it('should do something', function () {
    expect(!!countrylist).toBe(true);
  });

});
