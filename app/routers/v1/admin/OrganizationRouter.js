// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    '/messages': {
      get: { action: 'MessageController@getMessagesByOrg' }
    },
    resource: {
      controller: 'OrganizationController'
    }
  }
};
