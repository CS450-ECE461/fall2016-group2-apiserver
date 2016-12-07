var passport = require ('passport');

module.exports = exports = {
  '/v1': passport.authenticate ('bearer', { session: false }),
  '/dev': {
    '/users': {
      post: { action: 'UserController@create' }
    }
  },
  '/organizations': {
    post: { action: 'OrganizationRouter@create' }
  }
};
