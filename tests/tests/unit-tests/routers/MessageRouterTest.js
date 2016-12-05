var blueprint = require ('@onehilltech/blueprint')
    , request   = require ('supertest')
    , expect    = require ('chai').expect
    , async     = require ('async')
    ;

var messages = require ('../../../fixtures/messages')
    , appPath = require ('../../../fixtures/appPath')
    , users   = require ('../../../fixtures/users')
    , organizations = require ('../../../fixtures/organizations')
    ;

describe ('MessageRouter', function () {
    before(function (done) {
        blueprint.testing.createApplicationAndStart(appPath, done)
    });

    after (function (done) {
        blueprint.app.models.User.remove ({}, done);
    });
    describe ('/v1/messages', function () {

        var userAccessToken;
        var newUser;
        var org_id;

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
                var userData = users[0];
                var User = blueprint.app.models.User;
                newUser = new User(userData);
                newUser.org_id = org_id;

                newUser.save(function (err, user) {
                  if (err) {
                    return callback (err);
                  }

                  var data = {
                    email: user.email,
                    password: user.password
                  };

                  request(blueprint.app.server.app)
                  .post('/login')
                  .send(data)
                  .expect(200)
                  .end(function (err, res) {
                    if (err) {
                      return callback (err);
                    }

                    userAccessToken = res.body.token;
                    return callback ();
                  });
                });
              }
            ], done);
        });

        describe ('POST', function () {
            it ('should create a new message in the database', function (done) {
                var messageData = messages[0];
                request (blueprint.app.server.app)
                    .post ('/v1/messages')
                    .set ('Authorization', 'bearer ' + userAccessToken)
                    .send({message: messageData})
                    .expect (200)
                    .end(function (err, res) {
                        if (err) { return done (err); }

                        expect (res.body.message.receiver_email).to.equal (newUser.email);
                        return done ();
                    });
            });
        });
        describe ('GET', function () {
           it ('should retrieve all messages', function (done) {
             request (blueprint.app.server.app)
                 .get('/v1/messages')
                 .set('Authorization', 'bearer ' + userAccessToken)
                 .expect(200, done);
           });

           it ('should retrieve messages to be recieved by user', function (done) {
              request (blueprint.app.server.app)
                  .get ('/v1/messages/received')
                  .set('Authorization', 'bearer ' + userAccessToken)
                  .expect(200)
                  .end(function (err, res) {
                      if (err) { return done (err); }

                      expect (res.body.messages[0].receiver_email).to.equal (newUser.email);
                      return done ();
                  });

           });
        });

    });
});
