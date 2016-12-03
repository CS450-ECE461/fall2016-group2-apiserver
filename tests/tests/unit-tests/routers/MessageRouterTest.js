var blueprint = require ('@onehilltech/blueprint')
    , request   = require ('supertest')
    , expect    = require ('chai').expect
    ;

var messages = require ('../../fixtures/messages');
var appPath = require ('../../../fixtures/appPath');
var users   = require ('../../../fixtures/users');

describe ('MessageRouter', function () {
    before(function (done) {
        blueprint.testing.createApplicationAndStart(appPath, done)
    });

    after (function (done) {
        blueprint.app.models.User.remove ({}, done);
    });

    describe ('/v1/messages', function () {

        var userAccessToken;

        before (function (done) {
            var userData = users[0];
            var User = blueprint.app.models.User;
            var newUser = new User(userData);

            newUser.save(function (err, user) {
                if (err) {
                    return done(err);
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
                            return done(err);
                        }

                        userAccessToken = res.body.token;
                        return done();
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
        });

    });
});
