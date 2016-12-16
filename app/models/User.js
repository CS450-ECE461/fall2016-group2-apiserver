var mongodb = require ('@onehilltech/blueprint-mongodb')
  ;

const roles = ['user', 'admin'];

var schema = new mongodb.Schema({
  email:      {type: String, required: true, trim: true},
  username:   {type: String, required: true, trim: true},
  password:   {type: String, required: true, trim: true},
  job_title:  {type: String, required: true, trim: true},
  role:       {type: String, required: true, enum: roles},
  org_id:     {type: String, required: false, trim: true},
  token:      {type: String, required: false, trim: true}
});

const COLLECTION_NAME = 'user';

schema.methods.verifyPassword = function (password) {
  return this.password === password;
};

module.exports = exports = mongodb.model (COLLECTION_NAME, schema);
