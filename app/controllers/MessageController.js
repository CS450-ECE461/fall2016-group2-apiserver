'use strict';

var blueprint = require ('@onehilltech/blueprint')
  , mongodb = require ('@onehilltech/blueprint-mongodb')
  , ResourceController = mongodb.ResourceController
  , async = require ('async')
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
          /* istanbul ignore if */
          if (err) {
            return callback(err);
          }

          doc.org_id = user.org_id;
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

MessageController.prototype.getMessagesBySender = function () {
  return function (req, res) {
    var token = req.headers.authorization.split(' ')[1];

    async.waterfall ([
      function (callback) {
        User.findOne ({token: token}, callback)
      },
      function (user, callback) {
        Message.find ({sender_email: user.email}, {__v: 0}, callback);
      },
      function (messages, callback) {
        res.status (200).json ({messages: messages});
        return callback (null);
      }
    ],
    /* istanbul ignore next */
    function (err) {
      if (err) { res.status (400).send (err); }
    });
  }
};

MessageController.prototype.getMessagesByReceiver = function () {
    return function(req, res){
        // splits bearer and the token into an array ['bearer', token]
        var token = req.headers.authorization.split(' ')[1];

        async.waterfall([
            function(callback){
                User.findOne({token: token}, callback)
            },
            function (user, callback) {
                Message.find({receiver_email: user.email}, {__v: 0})
                    .where('expireAt').gte(Date.now())
                    .exec(callback);
            },
            function (messages, callback) {
                res.status(200).json({messages: messages});
                return callback(null);
            }
        ],
        /* istanbul ignore next */
        function(err) {
            if(err)
                res.status(400).send(err);
        });
    }
};

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;
