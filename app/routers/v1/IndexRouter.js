var isAdmin = require ('../../middleware/isAdmin');

module.exports = exports = {
  '/admin': isAdmin
};
