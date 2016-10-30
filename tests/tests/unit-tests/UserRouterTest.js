
var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath = require ('../../fixtures/appPath');
var users   = require ('../../fixtures/users');

describe ('UserRouter', function () {
  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done)
  });

  after (function (done) {
    blueprint.app.models.User.remove ({}, done);
  });

  describe ('/users', function () {

    var user = users[0];
    var userId;

    describe ('POST', function (done) {
      it ('should create a user in the database', function (done) {
        request (blueprint.app.server.app)
          .post ('/users') // route
          .send (user) // data being sent
          .expect (200) // expected statusCode

          // end actually sends the request and the callback handles the response
          // this is where you will want to perform your tests
          .end (function (err, res) {
            if (err) { return done (err); }

            userId = res.body.user._id;
            // note: user.user is because the request structure required
            expect (res.body.user.username).to.equal (user.user.username);

            // always return done() to continue the test chain
            return done();
          });
      });
    });

    describe ('GET', function (done) {
      it ('should get all users in the database', function (done) {
        // Use supertest to make a request and check response.
        request (blueprint.app.server.app)
          .get ('/users')
          .expect (200, done);
      });

      it ('should get single user in the database', function (done) {
        request (blueprint.app.server.app)
          .get ('/users/' + userId)
          .expect (200)
          .end (function (err, res) {
            if (err) { return done (err); }

            expect (res.body.user._id).to.equal (userId);
            return done ();
          });
      });
    });

    describe ('PUT', function (done) {
      it ('should update a single user in the database', function (done) {

        var updatedUser = user;
        updatedUser.user.job_title = 'developer';

        request (blueprint.app.server.app)
          .put ('/users/' + userId)
          .send (updatedUser)
          .expect (200)
          .end (function (err, res) {
            if (err) { return done (err); }

            expect (res.body.user.job_title).to.equal ('developer');
            return done ();
          });
      });
    });

    describe ('DELETE', function (done) {
      it ('should delete a single user in the database', function (done) {
        request (blueprint.app.server.app)
          .delete ('/users/' + userId)
          .expect (200, done);
      });
    });
  });
});
