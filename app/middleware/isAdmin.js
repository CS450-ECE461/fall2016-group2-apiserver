var User = require ('../models/User');

function isAdmin (req, res, next) {
  // splits bearer and the token into an array ['bearer', token]
  var token = req.headers.authorization.split(' ')[1];

  // retrieve user by token
  User.findOne ({token: token}, function (err, user) {
    if (err) { return next (err); }

    // verify that the user has the admin role
    var role = user.role;
    if (role != 'admin') {
      return res.status (401).send ('User is a not an admin');
    }

    return next ();
  });
}

module.exports = exports = isAdmin;
