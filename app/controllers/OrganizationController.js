var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  ;

var Organization = require ('../models/Organization')
  ;

// this code effectively subclasses ResourceController with the specific information below
function OrganizationController () {
  ResourceController.call (this, {name: 'organization', model: Organization});
}

blueprint.controller (OrganizationController, ResourceController);

// preCreate function to verify if organization has already been created
OrganizationController.prototype.create = function () {
  var opts = {
    on: {
      preCreate: function (req, doc, callback){
        Organization.findOne({ name: req.body.name }, function (err, organization) {
          if (err) { return callback (err); }

          if (organization){
            return callback (new Error ('Organization already exists'), doc);
          } else {
            return callback (null, doc);
          }
        });
      }
    }
  };
  return mongodb.ResourceController.prototype.create.call(this, opts);
};

module.exports = exports = OrganizationController;
