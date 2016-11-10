var blueprint = require ('@onehilltech/blueprint')
  , request   = require ('supertest')
  , expect    = require ('chai').expect
  ;

var appPath         = require ('../../../fixtures/appPath');
var organizations   = require ('../../../fixtures/organizations');
var users   = require ('../../../fixtures/users');

describe ('OrganizationRouter', function () {
  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done)
  });

  after (function (done) {
    blueprint.app.models.Organization.remove ({}, done);
  });

  describe ('v1/admin/organizations', function () {

    var adminData;
    var adminAccessToken;

    var userData;
    var userId;

    var organizationData;
    var organizationId;

    before (function (done) {
      adminData = users[1];
      organizationData = organizations[0];

      var User = blueprint.app.models.User;
      var newAdmin = new User (adminData);

      newAdmin.save (function (err, user) {
        if (err) { return done (err); }

        var data = {
          username: user.username,
          password: user.password
        }

        request (blueprint.app.server.app)
          .post ('/login')
          .send (data)
          .expect (200)
          .end (function (err, res) {
            if (err) {
              return done (err);
            }

            adminAccessToken = res.body.token;
            return done ();
          });
      });
    });

    describe ('Authentication', function () {

      var userAccessToken;

      before (function (done) {
        userData = users[0];
        var User = blueprint.app.models.User;
        var newUser = new User (userData);

        newUser.save (function (err, user) {
          if (err) { return done (err); }

          var data = {
            username: user.username,
            password: user.password
          }

          request (blueprint.app.server.app)
            .post ('/login')
            .send (data)
            .expect (200)
            .end (function (err, res) {
              if (err) {
                return done (err);
              }

              userAccessToken = res.body.token;
              return done ();
            });
        });
      });

      it ('should allow admin to access organization routes', function (done) {
        request (blueprint.app.server.app)
          .get ('/v1/admin/organizations') // route
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .expect (200, done);
      });

      it ('should not allow user to access organization routes', function (done) {
        request (blueprint.app.server.app)
          .get ('/v1/admin/organizations') // route
          .set ('Authorization', 'bearer ' + userAccessToken)
          .expect (401, done);
      });
    });

    describe ('POST', function () {
      it ('should create an organization in the database', function (done) {
        request (blueprint.app.server.app)
          .post ('/v1/admin/organizations') // route
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .send ({organization: organizationData}) // data being sent
          .expect (200) // expected statusCode

          // end actually sends the request and the callback handles the response
          // this is where you will want to perform your tests
          .end (function (err, res) {
            if (err) { return done (err); }

            organizationId= res.body.organization._id;
            // note: user.user is because the request structure required
            expect (res.body.organization.name).to.equal (organizationData.name);
            // always return done() to continue the test chain
            return done();
          });
      });
    });

    describe ('GET', function (done) {
      it ('should get all organizations in the database', function (done) {
        // Use supertest to make a request and check response.
        request (blueprint.app.server.app)
          .get ('/v1/admin/organizations')
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .expect (200, done);
      });

      it ('should get single user in the database', function (done) {
        request (blueprint.app.server.app)
          .get ('/v1/admin/organizations/' + organizationId)
          .set ('Authorization', 'bearer ' + adminAccessToken)
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

        var updatedOrganization = organizationData;
        updatedOrganization.website = 'webweb@org.com';

        request (blueprint.app.server.app)
          .put ('/v1/admin/organizations/' + organizationId)
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .send ({organization: updatedOrganization})
          .expect (200)
          .end (function (err, res) {
            if (err) { return done (err); }

            expect (res.body.organization.website).to.equal ('webweb@org.com');
            return done ();
          });
      });
    });

    describe ('DELETE', function (done) {
      it ('should delete a single organization in the database', function (done) {
        request (blueprint.app.server.app)
          .delete ('/v1/admin/organizations/' + organizationId)
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .expect (200, done);
      });
    });
  });
});
