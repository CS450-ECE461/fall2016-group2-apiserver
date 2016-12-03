var blueprint = require ('@onehilltech/blueprint')
    , request   = require ('supertest')
    , expect    = require ('chai').expect
    ;

var messages = require ('../../../fixtures/messages');
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
        var messageData;
        var userData;

        before (function (done) {
            userData = users[0];
            var User = blueprint.app.models.User;
            var newUser = new User(userData);
            messageData = messages[0];

            newUser.save(function (err, user) {
                if (err) {
                    return done(err);
                }

                var data = {
                    username: user.username,
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

        describe ('POST', function () {
            it ('should create a new message in the database', function (done){
                request (blueprint.app.server.app)
                    .post ('/v1/messages')
                    .set ('Authorization', 'bearer ' + userAccessToken)
                    .send({message: messageData})
                    .expect (200)
                    .end(function (err, res) {
                        console.log('res: ', res);
                        if (err) { return done (err); }

                        expect (res.body.message.receiver_email).to.equal (userData.email);
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

                      expect (res.body.messages[0].receiver_email).to.equal (userData.email);
                      return done ();
                  });

           });
        });

    });
});
