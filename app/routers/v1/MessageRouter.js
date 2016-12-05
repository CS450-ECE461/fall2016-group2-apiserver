// MessageRouter
module.exports = exports = {
    '/messages' : {
        get: { action: 'MessageController@getAll' },
        post: { action: 'MessageController@create' },

        '/received' : {
            get: { action: 'MessageController@getMessagesByReceiver'}
        },
        '/:messageId': {
            get: { action: 'MessageController@get' },
            put: { action: 'MessageController@update' }
        }
    }
};
