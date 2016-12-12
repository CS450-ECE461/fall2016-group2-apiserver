// UserRouter
module.exports = exports = {
  '/users' : {
    '/profile': {
      get: { action: 'UserController@profile' }
    }
  }
};
