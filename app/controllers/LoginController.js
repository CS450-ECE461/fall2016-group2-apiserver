var blueprint = require ('@onehilltech/blueprint')
  , jwt = require ('jsonwebtoken')
  ;

var User = require ('../models/User')
  ;

// this code effectively subclasses ResourceController with the specific information below
function LoginController () {
  blueprint.BaseController.call (this);
}

blueprint.controller (LoginController);

LoginController.prototype.login = function () {
  return {
    validate: function (req, callback) {
      req.checkBody ('email', 'Missing email parameter').notEmpty ();
      req.checkBody ('password', 'Missing password parameter').notEmpty ();
      return callback (req.validationErrors (true));
    },

    sanitize: function (req, callback) {
      req.sanitizeBody ('email').toString ();
      req.sanitizeBody ('password').toString ();
      return callback (null);
    },

    execute: function (req, res, callback) {
      var data = {email: req.body.email};

      User.findOne (data, function (err, user) {
        /* instanbul ignore if */
        if (err) { return callback (err); }

        if (!user) {
          res.status (404).send ('User not found');
        }
        else if (!user.verifyPassword (req.body.password)) {
          res.status (400).send ('invalid password');
        }
        else {
          var secret = blueprint.app.configs.server.middleware.jwt.secret;
          var access_token = jwt.sign ({ _id: user._id }, secret);

          delete user.token;

          user.token = access_token;
          user.save (function (err, user) {
            if (err) { return callback (err); }

            res.status (200).json ({ token: user.token });
          });
        }
      });
    }
  }
}

module.exports = exports = LoginController;
