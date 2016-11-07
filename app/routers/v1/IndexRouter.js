var authenticate = require ('../../middleware/authenticate');

module.exports = exports = {
  '/admin': authenticate.isAdminToken
};
