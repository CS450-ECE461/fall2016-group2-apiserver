// app/listeners/app.init/initPassport.js

var passport       = require ('passport')
  , BearerStrategy = require ('passport-http-bearer').Strategy
  ;

module.exports = initPassport;

function initPassport (app) {
  var User = app.models.User;

  passport.use(new BearerStrategy(
    function(token, done) {
      User.findOne({ token: token }, function (err, user) {
        /* instanbul ignore if */
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
      });
    }
  ));
}
