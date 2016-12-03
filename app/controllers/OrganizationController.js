var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , messaging = blueprint.messaging
  , async = require ('async')
  , nodemailer = require ('nodemailer')
  , nodeMailers = require ('../middleware/nodeMailers')
  ;

var User = require ('../models/User')
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
      preCreate: function (req, doc, callback) {
        Organization.findOne({ name: doc.name }, function (err, organization) {
          if (err) { return callback (err); }

          if (organization) {
            return callback ('Organization already exists', null);
          } else {
            return callback (null, doc);
          }
        });
      },
      postExecute: function (req, organization, cb) {
        async.waterfall ([
          function (callback) {
            // create dummy admin data
            var adminData = {
              email: req.body.user.email,
              username: 'admin',
              password: 'password',
              org_id: organization._id,
              role: 'admin',
              job_title: 'administrator'
            };

            var User = blueprint.app.models.User;
            var newAdmin = new User (adminData);

            newAdmin.save (function (err, user) {
              if (err) { return callback (err); }

              callback (null, {user: user, organization: organization});
            });
          },
          nodeMailers.resolveMailer()
        ], cb);
      }
    }
  };
  return mongodb.ResourceController.prototype.create.call(this, opts);
};

module.exports = exports = OrganizationController;
