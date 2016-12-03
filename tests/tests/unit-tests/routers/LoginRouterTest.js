var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath = require ('../../../fixtures/appPath');
var users   = require ('../../../fixtures/users');

describe ('LoginRouter', function () {

  var userData;

  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done)
  });

  after (function (done) {
    blueprint.app.models.User.remove ({}, done);
  });

  describe ('/login', function () {

    userData = users[0];
    var token;
    var credentials;

    before (function (done) {
      var User = blueprint.app.models.User;
      var newUser = new User (userData);

      newUser.save(function (err, user) {
        if (err) { return done (err); }

        credentials = {
          email: user.email,
          password: user.password
        }

        return done ();
      });
    });

    describe ('POST', function () {
      it ('should return valid access_token on login', function (done) {
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

      it ('should fail to login with invalid email', function (done) {
        var wrongCredentials = {
          email: 'wrong',
          password: credentials.password
        }

        request (blueprint.app.server.app)
          .post ('/login')
          .send (wrongCredentials)
          .expect (404, done);
      });

      it ('should fail to login with invalid password', function (done) {
        var wrongCredentials = {
          email: credentials.email,
          password: 'wrong'
        }

        request (blueprint.app.server.app)
          .post ('/login')
          .send (wrongCredentials)
          .expect (400, done);
      });

      it ('should fail to validate credentials on login', function (done) {
        var wrongCredentials = {
          email: credentials.email
        }

        request (blueprint.app.server.app)
          .post ('/login')
          .send (wrongCredentials)
          .expect (400, done);
      });
    });
  });

  describe ('/admin/login', function () {

    var adminData = users[1];
    var token;
    var credentials;

    before (function (done) {
      var User = blueprint.app.models.User;
      var newUser = new User (adminData);

      newUser.save(function (err, user) {
        if (err) { return done (err); }

        credentials = {
          email: user.email,
          password: user.password
        }

        return done ();
      });
    });

    describe ('POST', function () {
      it ('should login with valid admin credentials', function (done) {
        request (blueprint.app.server.app)
          .post ('/admin/login')
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

      it ('should fail to login with user credentials', function (done) {
        var invalidCredentials = {
          email: userData.email,
          password: userData.password
        }

        request (blueprint.app.server.app)
          .post ('/admin/login')
          .send (invalidCredentials)
          .expect (403, done);
      });

      it ('should fail to login with an unknown email', function (done) {
          var unknownCredentials = {
              email: 'unknown',
              password: credentials.password
          }

          request(blueprint.app.server.app)
              .post ('/admin/login')
              .send (unknownCredentials)
              .expect (404, done);

      });
    });
  });
});
