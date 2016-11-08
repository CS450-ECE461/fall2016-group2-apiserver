// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    get: { action: 'OrganizationController@getAll' },

    '/:organizationId': {
      get: { action: 'OrganizationController@get' },
      put: { action: 'OrganizationController@update' }
    }
  }
};
