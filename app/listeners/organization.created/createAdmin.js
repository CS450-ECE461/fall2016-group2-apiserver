var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  ;

// Create admin listener
module.exports = exports = function (organization) {
  ResourceController.call (this, {name: 'user', model: User});
};
