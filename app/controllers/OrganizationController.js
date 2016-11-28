var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , messaging = blueprint.messaging
  , async = require ('async')
  , nodemailer = require ('nodemailer')
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
            var user = req.body.user;
            var email = undefined;
            if (user) {
              email = user.email;
            }

            // create dummy admin data
            var adminData = {
              email: email || 'test@test.org',
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

          function (docs, callback) {

            var emailer = 'HiveEmailer@gmail.com';

            var connection = {
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: emailer,
                pass: 'ch4ng3m3'
              },
              logger: true
            };

            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport(connection);

            var message = '<p>Thank you ' + docs.organization.name + ' for joining Hive!</p>';
            message += '<p>Your admin credentials are listed below!</p>';
            message += '<p>username: ' + docs.user.username + '</p>';
            message += '<p>password: ' + docs.user.password + '</p>';

            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: '"HiveEmailer" <' + emailer + '>', // sender address
              //to: '"Danny Peck" <danieljpeck93@gmail.com>',
              to: '"' + docs.user.username + '"' + ' <' + docs.user.email + '>', // list of receivers
              subject: 'Welcome to Hive', // Subject line
              text: 'Here is your admin username and password:', // plaintext body
              html: message
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(err, info){
              if (err) { return callback (err); }

              console.log('Message sent: ' + info.response);
              callback (null, {org_id: docs.organization._id, admin_id: docs.user._id});
            });
          }
        ], cb);
      }
    }
  };
  return mongodb.ResourceController.prototype.create.call(this, opts);
};

module.exports = exports = OrganizationController;
