// OrganizationRouter
module.exports = exports = {
  '/organizations' : {
    resource: {
      controller: 'OrganizationController',

      // optional list of operations to allow
      allow: ['getOne', 'getAll', 'update'],

      // optional list of operations to allow
      deny: ['create', 'delete'],
    }
  }
};
