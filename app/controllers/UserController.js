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

UserController.prototype.create = function ()
{
  var opts = {
    on: {
      preCreate: function (req, doc, callback) {
        User.findOne ({ username: doc.username, org_id: doc.org_id }, function (err, user) {
          if (err) { return callack (err); }

          if (user) {
            return callback ('user already exists', null);
          } else {
            return callback (null, doc);
          }
        });
      }
    }
  };

  return mongodb.ResourceController.prototype.create.call (this, opts);
};


module.exports = exports = UserController;
