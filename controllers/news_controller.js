var db = require("../models")
var path = require("path");

var express = require("express");
var router = express.Router();
module.exports = router;
// Import the model (burger.js) to use its database functions.
//var article = require("../models/article.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  console.log("-------------controller: router.get / Article.find render index");
db.Article.find({  }, function (err, data) {
  if (err) return handleError(err);
  // Prints
  var newsObject = {
    article: data
  }
  console.log("news router / "+newsObject) 
      res.render("index", newsObject);
  //console.log('%s %s is a %s.', Article.title, person.name.last,
    //person.occupation);
   });
//  burger.selectAll(function(data) {
//    var hbsObject = {
//      burgers: data
//    };
//  console.log("controller: router.get / res.render index hbsObject "+JSON.stringify(hbsObject));

  });


//module.exports = function(app) {
/*
app.get("/articles",function(req,res) {
	//var Article = mongoose.model('Article', yourSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Article.find({  }, function (err, articles) {
  if (err) return handleError(err);
  // Prints
  console.log("fetch app.get /articles "+articles) 
  //console.log('%s %s is a %s.', Article.title, person.name.last,
    //person.occupation);
});
})*/


//}
