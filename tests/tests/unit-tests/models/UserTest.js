var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath = require ('../../../fixtures/appPath');
var users   = require ('../../../fixtures/users');
var User    = require ('../../../../app/models/User');

describe ('UserModel', function () {

  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done);
  });

  after (function (done) {
    blueprint.app.models.User.remove ({}, done);
  });

  describe ('Instance Methods', function () {
    var user;

    before (function (done) {
      // intialize test user
      var userData = users[0];
      user = new User(userData);

      return done ();
    });

    it ('should succeed to verifyPassword with correct password', function (done) {
      expect (user.verifyPassword('test')).to.be.true;
      return done ();
    });

    it ('should fail to verifyPassword with wrong password', function (done) {
      expect (user.verifyPassword('incorrect')).to.be.false;
      return done ();
    });
  });
});
