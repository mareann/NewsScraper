/////////////////////////////////////////////////////////
// controllers/news_controller.js Maryann Jordan
// routes
/////////////////////////////////////////////////////////

var db = require("../models")
var path = require("path");

var express = require("express");
var router = express.Router();
module.exports = router;

// notes
// output newsObject.article
// { _id: 5acbaf554e656d39c54d7a79,
//  title: '\n\nTRUMP CONDEMNS ‘ANIMAL ASSAD’ — SHUTS OUT VICTIMS\n\n',
//  link: 'https://www.huffingtonpost.com//entry/trump-syria-refugees_us_5acb501be4b07a3485e68a3d',
//  __v: 0 },{ _id: 5acbaf554e656d39c54d7a7a,
//  title: '\n\nRepublicans Giving Up House Seats At A Rate Not Seen In Decades\n\n',
//  link: 'https://www.huffingtonpost.com//entry/congress-retirements-record_us_5acb8fc6e4b0337ad1ea639e',
//  __v: 0 },...

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  console.log("--- controller: router.get / Article.find render index");
  db.Article.find({  }, function (err, data) {
   
    console.log("--- controller: router.get data.length "+data.length)
    if (err) {
      console.log("--- controller: router.get / error "+err)
      return handleError(err);
    }
    var newsObject = {
    article: data
    }

    console.log("--- controller: res.render(index, newsObject)")
    //renders on / page
    res.render("index", newsObject);
  });
})

