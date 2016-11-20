var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , users   = require ('../../../fixtures/users')
  ;

var User = require ('../models/User')
  ;

module.exports = exports = function (organization) {

  adminData = users[1];

  var User = blueprint.app.models.User;
  newAdmin = new User (adminData);

  newAdmin.save (function (err, user) {
    if (err) { return done (err); }

    return done ();
  });
};
