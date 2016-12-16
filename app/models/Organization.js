var mongodb = require ('@onehilltech/blueprint-mongodb')
  ;

var schema = new mongodb.Schema({
  name:       {type: String, required: true, trim: true},
  location:   {type: String, required: true, trim: true},
  website:    {type: String, required: true, trim: true},
  industry:   {type: String, required: true, trim: true}
});

const COLLECTION_NAME = 'organization';

module.exports = exports = mongodb.model (COLLECTION_NAME, schema);
