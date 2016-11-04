var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , jwt = require ('jsonwebtoken')
  ;

var User = require ('../models/User')
  ;

// this code effectively subclasses ResourceController with the specific information below
function UserController () {
  ResourceController.call (this, {name: 'user', model: User});
}

blueprint.controller (UserController, ResourceController);

UserController.prototype.login = function () {
  return {
    validate: function (req, callback) {
      req.checkBody ('username', 'Missing username parameter').notEmpty ();
      req.checkBody ('password', 'Missing password parameter').notEmpty ();
      return callback (req.validationErrors (true));
    },

    sanitize: function (req, callback) {
      req.sanitizeBody ('username').toString ();
      req.sanitizeBody ('password').toString ();
      return callback (null);
    },

    execute: function (req, res, callback) {
      var data = {username: req.body.username};

      User.findOne (data, function (err, user) {
        if (err) {
          return callback (err);
        }

        if (!user) {
          res.status (404).send ('User not found');
        }
        else if (!user.verifyPassword (req.body.password)) {
          res.status (400).send ('invalid password');
        }
        else {
          var secret = blueprint.app.configs.server.middleware.jwt.secret;
          var access_token = jwt.sign (user, secret);
          res.status (200).json ({ token: access_token });
        }
      });
    }
  }
}

module.exports = exports = UserController;
