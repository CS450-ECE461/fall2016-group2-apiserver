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

MessageController.prototype.create = function () {
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

MessageController.prototype.getMessagesByOrg = function () {
  return function (req, res) {
    var token = req.headers.authorization.split(' ')[1];

    User.findOne({token: token}, function (err, user) {
      /* istanbul ignore if */
      if (err) {
        res.status(400).json(err);
        /* istanbul ignore if */
      } else if (!user) {
        res.status(404).send('User not found');
      } else {
        var org_id = user.org_id;
        Message.find({org_id: org_id}, {__v: 0}, function (error, messages) {
          /* istanbul ignore if */
          if (error) {
            res.status(400).json(error);
          } else {
            res.status(200).json(messages);
          }
        });
      }
    });
  }
};

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;
