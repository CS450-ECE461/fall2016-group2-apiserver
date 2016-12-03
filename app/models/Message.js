var mongodb = require ('@onehilltech/blueprint-mongodb')
    ;

var schema = new mongodb.Schema ({
    sender_id:      {type: String, required: true, trim: true},
    receiver_id:    {type: String, required: true, trim: true},
    received:       {type: Boolean, required: true},
    viewed:         {type: Boolean, required: true},
    timeout:        {type: Date, required: true},
    title:          {type: String, required: true, trim: true},
    content:        {type: String, required: true, trim: true}
});

const COLLECTION_NAME = 'Message';
module.exports = exports = mongodb.model  (COLLECTION_NAME, schema);