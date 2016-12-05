'use strict';

var blueprint = require ('@onehilltech/blueprint')
    , mongodb = require ('@onehilltech/blueprint-mongodb')
    , ResourceController = mongodb.ResourceController
    , async = require('async')
    ;

var Message = require ('../models/Message')
    , User = require ('../models/User')
    ;

function MessageController () {
    ResourceController.call (this, {name: 'message', model: Message});
}

blueprint.controller (MessageController, ResourceController);

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
        ], function(err) {
                if(err)
                    res.status(400).send(err);
        });
    }
};


module.exports = MessageController;
