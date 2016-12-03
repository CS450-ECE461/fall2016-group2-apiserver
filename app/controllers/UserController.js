var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  ;

var User = require ('../models/User')
  ;

// this code effectively subclasses ResourceController with the specific information below
function UserController () {
  ResourceController.call (this, {name: 'user', model: User});
}

UserController.prototype.getUsersByOrg = function () {
  return function (req, res) {
    var token = req.headers.authorization.split(' ')[1];

    User.findOne({token: token}, function (err, user) {
      if (err) {
        res.status(400).json(err);
      } else if (!user) {
        res.status(404).send('User not found');
      } else {
        var org_id = user.org_id;
        User.find({org_id:org_id}, {__v: 0, token: 0, password: 0}, function (error, users) {
          if (error) {
            res.status(400).json(error);
          } else {
            res.status(200).json(users);
          }
        });
      }
    });
  }
};

blueprint.controller (UserController, ResourceController);

module.exports = exports = UserController;
