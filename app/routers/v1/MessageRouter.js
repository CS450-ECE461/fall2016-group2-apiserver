// MessageRouter
module.exports = exports = {
    '/messages' : {
        get: { action: 'MessageController@getAll' },
        post: { action: 'MessageController@create' },

        '/sent': {
          get: { action: 'MessageController@getMessagesBySender' }
        },

        '/received' : {
            get: { action: 'MessageController@getMessagesByReceiver'}
        },
        '/:messageId': {
            get: { action: 'MessageController@get' },
            put: { action: 'MessageController@update' }
        }
    }
};
