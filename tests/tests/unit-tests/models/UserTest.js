var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath = require ('../../../fixtures/appPath');
var users   = require ('../../../fixtures/users');
var User    = require ('../../../../app/models/User');

describe ('UserModel', function () {

  var user;

  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done);

    // intialize test user
    var userData = users[0].user;
    user = new User(userData);
  });

  after (function (done) {
    blueprint.app.models.User.remove ({}, done);
  });

  describe ('Instance Methods', function () {
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
