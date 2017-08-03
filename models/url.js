var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var urlSchema = {
    url: { type: String, required: true },
    urlShorter: { type: String, required: true, unique: true  },
    createdDate: { type: Date }

};

var schema = new mongoose.Schema( urlSchema );


module.exports = schema;
module.exports.urlSchema = urlSchema;