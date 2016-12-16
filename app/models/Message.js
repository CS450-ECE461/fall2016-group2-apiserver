var mongodb = require ('@onehilltech/blueprint-mongodb')
  ;

var Organization = require ('./Organization')
  ;

var schema = new mongodb.Schema ({
  org_id:   {type: mongodb.Schema.ObjectId, ref: Organization.modelName, required: false, validation: { optional: true }},
  sender:   {type: String, required: false, trim: true},
  receiver: {type: String, required: true, trim: true},
  received: {type: Boolean, required: true},
  viewed:   {type: Boolean, required: true},
  expireAt: {type: Date, required: false, default: Date.now()},
  title:    {type: String, required: true, trim: true},
  content:  {type: String, required: true, trim: true}
});

const COLLECTION_NAME = 'Message';
module.exports = exports = mongodb.model  (COLLECTION_NAME, schema);
