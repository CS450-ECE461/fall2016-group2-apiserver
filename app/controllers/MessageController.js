'use strict';

var blueprint = require ('@onehilltech/blueprint')
    , mongodb = require ('@onehilltech/blueprint-mongodb')
    , ResourceController = mongodb.ResourceController
    ;

var Message = require ('../models/Message')

function MessageController () {
    ResourceController.call (this, {name: 'message', model: Message});
}

blueprint.controller (MessageController, ResourceController);

module.exports = MessageController;
