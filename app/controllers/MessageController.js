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

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;
