// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    get: { action: 'OrganizationController@getAll' },
    put: { action: 'OrganizationController@update' },

    '/users': {
      get: { action: 'UserController@getUsersByOrg' }
    },

    '/messages': {
      get: { action: 'MessageController@getMessagesByOrg' }
    },

    '/:organizationId': {
      get: { action: 'OrganizationController@get' }
    }
  }
};
