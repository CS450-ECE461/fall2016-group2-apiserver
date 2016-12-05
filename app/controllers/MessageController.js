'use strict';

var blueprint = require ('@onehilltech/blueprint')
    , mongodb = require ('@onehilltech/blueprint-mongodb')
    , ResourceController = mongodb.ResourceController
    ;

var Message = require ('../models/Message')
  , User    = require ('../models/User')
  ;

function MessageController () {
    ResourceController.call (this, {name: 'message', model: Message});
}

MessageController.prototype.create = function ()
{
  var opts = {
    on: {
      preCreate: function (req, doc, callback) {
        var token = req.headers.authorization.split(' ')[1];

        User.findOne({token: token}, function (err, user) {
          if (err) {
            return callback(err);
          }

          doc.message.org_id = user.org_id;
          return callback(null, doc);
        });
      }
    }
  };

  return mongodb.ResourceController.prototype.create.call (this, opts);
};

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;
