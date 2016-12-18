// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    '/users': {
      get: { action: 'UserController@getUsersByOrg' }
    },
    resource: {
      controller: 'OrganizationController',
      deny: ['create', 'delete']
    }

  }
};
