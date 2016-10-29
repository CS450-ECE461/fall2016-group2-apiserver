var mongodb = require ('@onehilltech/blueprint-mongodb')
  ;

var schema = new mongodb.Schema({
  email:      {type: String, required: true, trim: true},
  username:   {type: String, required: true, trim: true},
  password:   {type: String, required: true, trim: true},
  job_title:  {type: String, required: true, trim: true},
  org_id:     {type: String, required: false, trim: true}, // not required until orgs exist
});

const COLLECTION_NAME = 'user';

schema.methods.verifyPassword = function (password) {
  if (this.password == password) {
    return true;
  }

  return false;
};

module.exports = exports = mongodb.model (COLLECTION_NAME, schema);
