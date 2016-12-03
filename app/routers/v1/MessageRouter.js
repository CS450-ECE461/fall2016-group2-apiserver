// MessageRouter
module.exports = exports = {
    '/messages' : {
        get: { action: 'MessageController@getAll' },

        '/:messageId': {
            get: { action: 'MessageController@get' },
            put: { action: 'MessageController@update' },
            post: { action: 'MessageController@create' }
        },
        '/received' : {
            get: { action: 'MessageController@getMessagesByReceiver'}
        }
    }
};
