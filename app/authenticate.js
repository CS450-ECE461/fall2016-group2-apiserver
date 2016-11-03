var blueprint = require ('@onehilltech/blueprint')
  , jwt       = require ('jsonwebtoken')
  ;

function authenticate (req, res, next) {
  var secret = blueprint.app.configs.server.middleware.jwt.secret;
  var token = req.headers.authorization;

  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return res.status (400).json ('invalid token');
    }

    next ();
  });
}

module.exports = exports = authenticate;
