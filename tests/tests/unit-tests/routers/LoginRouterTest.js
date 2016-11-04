var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath = require ('../../../fixtures/appPath');
var users   = require ('../../../fixtures/users');

describe ('LoginRouter', function () {
  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done)
  });

  after (function (done) {
    blueprint.app.models.User.remove ({}, done);
  });

  describe ('/login', function () {

    var userData = users[0].user;
    var token;

    describe ('POST', function () {
      it ('should return valid access_token on login', function (done) {
        var User = blueprint.app.models.User;
        var newUser = new User (userData);

        newUser.save(function (err, user) {
          if (err) { return done (err); }

          var credentials = {
            username: user.username,
            password: user.password
          }

          request (blueprint.app.server.app)
            .post ('/login')
            .send (credentials)
            .expect (200)
            .end (function (err, res) {
              if (err) {
                return done (err);
              }

              token = res.body.token;
              expect (token).to.not.be.undefined;
              return done ();
            });
        });
      });
    });
  });
});
