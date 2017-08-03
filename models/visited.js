var mongoose = require('mongoose');

var visitedSchema = {
    urlId: { type: Schema.Types.ObjectId, required: true },
    visitedDate: { type: Date }

};

var schema = new mongoose.Schema( visitedSchema );


module.exports = schema;
module.exports.visitedSchema = visitedSchema;