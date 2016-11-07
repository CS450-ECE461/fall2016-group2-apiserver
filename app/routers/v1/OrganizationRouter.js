// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    get: { action: 'OrganizationController@getAll' },

    '/:OrganizationId': {
      get: { action: 'OrganizationController@get' },
      put: { action: 'OrganizationController@update' }
    }
  }
};
