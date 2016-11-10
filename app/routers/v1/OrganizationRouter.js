// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    resource: {
      controller: 'OrganizationController',

      // optional list of operations to allow
      deny: ['create', 'delete'],
    }
  }
};
