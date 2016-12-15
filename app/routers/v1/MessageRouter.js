// MessageRouter
module.exports = exports = {
  '/messages' : {
    '/sent': {
      get: { action: 'MessageController@getMessagesBySender' }
    },

    '/received' : {
      get: { action: 'MessageController@getMessagesByReceiver'}
    },

    resource: {
      controller: 'MessageController',
      deny: ['delete']
    }
  }
};
