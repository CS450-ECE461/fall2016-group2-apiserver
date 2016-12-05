// MessageRouter
module.exports = exports = {
    '/messages' : {
        get: { action: 'MessageController@getAll' },

        '/sent': {
          get: { action: 'MessageController@getMessagesBySender' }
        },

        '/:messageId': {
            get: { action: 'MessageController@get' },
            put: { action: 'MessageController@update' },
            post: { action: 'MessageController@create' }
        }
    }
};
