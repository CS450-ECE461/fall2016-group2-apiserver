// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    get: { action: 'OrganizationController@getAll' },
    put: { action: 'OrganizationController@update' },

    '/users': {
      get: { action: 'UserController@getUsersByOrg' }
    },

    '/:organizationId': {
      get: { action: 'OrganizationController@get' }
    }
  }
};
