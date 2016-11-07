var authenticate = require ('../middleware/authenticate');

// UserRouter
module.exports = exports = {
  '/login': {
    post: { action: 'LoginController@login' }
  },
  '/admin': {
    '/login': {
      use: authenticate.isAdminUser,
      post: { action: 'LoginController@login' }
    }
  }
};
