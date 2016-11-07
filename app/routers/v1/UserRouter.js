// UserRouter
module.exports = exports = {
  '/users' : {
    get: { action: 'UserController@getAll' },

    '/:userId': {
      get: { action: 'UserController@get' },
      put: { action: 'UserController@update' }
    }
  }
};
