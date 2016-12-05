var blueprint     = require ('@onehilltech/blueprint')
  , request       = require ('supertest')
  , expect        = require ('chai').expect
  , nodemailer    = require ('nodemailer')
  , stubTransport = require ('nodemailer-stub-transport')
  , async         = require ('async')
  ;

var appPath         = require ('../../../fixtures/appPath');
var organizations   = require ('../../../fixtures/organizations');
var users           = require ('../../../fixtures/users');

describe ('OrganizationRouter', function () {
  before (function (done) {
    blueprint.testing.createApplicationAndStart (appPath, done)
  });

  after (function (done) {
    blueprint.app.models.User.remove ({});
    blueprint.app.models.Organization.remove ({}, done);
  });

  describe ('v1/admin/organizations', function () {

    var adminData;
    var adminAccessToken;

    var userData;

    var organizationData = organizations[0];
    var org_id;
    var organizationId;

    before (function (done) {
      async.series ([
        function (callback) {
          var Organization = blueprint.app.models.Organization;
          var orgData = organizations[0].organization;

          var organization = new Organization (orgData);
          organization.save (function (err, res) {
            if (err) { return callback (err); }

            org_id = res._id;
            return callback ();
          });
        },

        function (callback) {
          adminData = users[1];

          var User = blueprint.app.models.User;
          var newAdmin = new User (adminData);
          newAdmin.org_id = org_id;

          newAdmin.save (function (err, user) {
            if (err) { return callback (err); }

            var data = {
              email: user.email,
              password: user.password
            };

            request (blueprint.app.server.app)
            .post ('/admin/login')
            .send (data)
            .expect (200)
            .end (function (err, res) {
              if (err) { return callback (err); }

              adminAccessToken = res.body.token;
              return callback ();
            });
          });
        }
      ], done);
    });

    describe ('Authentication', function () {

      var userAccessToken;

      before (function (done) {
        userData = users[0];
        var User = blueprint.app.models.User;
        var newUser = new User (userData);
        newUser.org_id = org_id;

        newUser.save (function (err, user) {
          if (err) { return done (err); }

          var data = {
            email: user.email,
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
          .expect (403, done);
      });
    });

    describe ('POST', function () {

      var adminId;

      it ('should create an organization in the database', function (done) {
        var orgData = organizations[1];
        request (blueprint.app.server.app)
          .post ('/organizations')
          .send (orgData)
          .expect (200)

          .end (function (err, res) {
            if (err) { return done (err); }

            adminId = res.body.organization.admin_id;
            organizationId = res.body.organization.org_id;
            expect (res.body.organization.org_id).to.not.be.undefined;
            return done ();
          });
      });

      it ('should create a new admin after creating an organization', function (done) {
        request (blueprint.app.server.app)
        .get ('/v1/admin/users/' + adminId)
        .set ('Authorization', 'bearer ' + adminAccessToken)
        .expect (200)
        .end (function (err, res) {
          if (err) { return done (err); }

          expect (res.body.user.role).to.equal ('admin');
          return done ();
        });
      });

      it ('should fail to create an organization with existing name', function (done) {
        var newOrgData = organizations[1];
        newOrgData.organization.name = organizations[0].organization.name;
        request (blueprint.app.server.app)
          .post ('/organizations')
          .send (newOrgData)
          .expect (400, done);
      });
    });

    describe ('GET', function (done) {
      it ('should get all organizations in the database', function (done) {
        request (blueprint.app.server.app)
          .get ('/v1/admin/organizations')
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .expect (200, done);
      });

      it ('should get single organization in the database', function (done) {
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
        updatedOrganization.organization.website = 'webweb@org.com';

        request (blueprint.app.server.app)
          .put ('/v1/admin/organizations/' + org_id)
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .send (updatedOrganization)
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
          .delete ('/v1/admin/organizations/' + org_id)
          .set ('Authorization', 'bearer ' + adminAccessToken)
          .expect (200, done);
      });
    });
  });
});
