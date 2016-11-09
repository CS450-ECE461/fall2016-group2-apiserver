// OrganizationRouter
module.exports = exports = {
  '/organization' : {
    post: { action: 'OrganizationController@create' },

    resource: {
      controller: 'OrganizationController'
    },

    '/:organizationId': {
      delete: { action: 'OrganizationController@delete' }
    }
  }
};
