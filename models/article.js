/////////////////////////////////////////////////////////
// models/article.js                Maryann Jordan
/////////////////////////////////////////////////////////

var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
// Create Schema class
var Schema = mongoose.Schema;
//not work Schema.plugin(uniqueValidator);
// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true,
    unique: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

ArticleSchema.plugin(uniqueValidator);

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
