var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath = require ('../../fixtures/appPath');
var organizations   = require ('../../fixtures/organizations');

describe ('OrganizationRouter', function () {
  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done)
  });

  describe ('/organizations', function () {

    var organization = organizations[0];
    var organizationId;

    describe ('POST', function (done) {
      it ('should create an organization in the database', function (done) {
        request (blueprint.app.server.app)
          .post ('/organizations') // route
          .send (organization) // data being sent
          .expect (200) // expected statusCode

          // end actually sends the request and the callback handles the response
          // this is where you will want to perform your tests
          .end (function (err, res) {
            if (err) { return done (err); }

            organizationId = res.body.organization._id;
            // note: organization.organization is because the request structure required
            expect (res.body.organization.name).to.equal (organization.organization.name);

            // always return done() to continue the test chain
            return done();
          });
      });
    });

    describe ('GET', function (done) {
      it ('should get all organizaitons in the database', function (done) {
        // Use supertest to make a request and check response.
        request (blueprint.app.server.app)
          .get ('/organizations')
          .expect (200, done);
      });

      it ('should get single organization in the database', function (done) {
        request (blueprint.app.server.app)
          .get ('/organizations/' + organizationId)
          .expect (200)
          .end (function (err, res) {
            if (err) { return done (err); }

            expect (res.body.organization._id).to.equal (organizationId);
            return done ();
          });
      });
    });

    describe ('PUT', function (done) {
      it ('should update a single organization in the database', function (done) {

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
