var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  ;

var User = require ('../models/Organization')
  ;

// this code effectively subclasses ResourceController with the specific information below
function OrganizationController () {
  ResourceController.call (this, {name: 'organization', model: Organization});
}

blueprint.controller (OrganizationController, ResourceController);

module.exports = exports = OrganizationController;
