var User = require ('../models/User');

var authenticate = {};

authenticate.isAdminToken  = function (req, res, next) {
  // splits bearer and the token into an array ['bearer', token]
  var token = req.headers.authorization.split(' ')[1];

  // retrieve user by token
  User.findOne ({token: token}, function (err, user) {
    /* instanbul ignore if */
    if (err) { return next (err); }

    // verify that the user has the admin role
    var role = user.role;
    if (role != 'admin') {
      return res.status (403).send ('User is a not an admin');
    }

    return next ();
  });
}

authenticate.isAdminUser  = function (req, res, next) {
  var username = req.body.username;

  // retrieve user by token
  User.findOne ({username: username}, function (err, user) {
    /* instanbul ignore if */
    if (err) { return next (err); }

    // verify that the user has the admin role
    var role = user.role;
    if (role != 'admin') {
      return res.status (403).send ('User is a not an admin');
    }

    return next ();
  });
}

module.exports = exports = authenticate;
