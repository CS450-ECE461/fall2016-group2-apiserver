// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    get: { action: 'OrganizationController@getAll' },
    put: { action: 'OrganizationController@update' },

    '/:organizationId': {
      get: { action: 'OrganizationController@get' },

      '/users' : {
        get: { action: 'UserController@getAll' },

        '/:userId': {
          get: { action: 'UserController@get' },
          put: { action: 'UserController@update' }
        }
      }
    }
  }
};
