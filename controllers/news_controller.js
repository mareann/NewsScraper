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
//$(function() {
//  $("#scrapeButton").on("click", function(event) { 
//    event.preventDefault();
//router.get("/articles", function(req, res) {

router.get("/", function(req, res) {
  console.log("--- controller: router.get / Article.find render index");
  db.Article.find({  }, function (err, data) {
    if (err) return handleError(err);
    console.log("--- controller: router.get data.length "+data.length)
    var newsObject = {
    article: data
    }
    //prints all the data
//console.log("** controller: router.get / Article "+newsObject.article.title) 
console.log("--- controller: res.render(index, newsObject)")
    //renders on / page
    res.render("index", newsObject);
    //res.render("index", data); // note does not render

  // });
//})
  });
})
/*
router.get("/"+:AID, function(req, res) {
  console.log("--- controller: router.get / Article.find render index");
  db.Article.find({ _id:AID  }, function (err, data) {
    if (err) return handleError(err);
         console.log("--- controller: router.get /"+AID+" data.length "+data.length)
    var newsObject = {
    article: data
    }
    //prints all the data
//console.log("** controller: router.get / Article "+newsObject.article.title) 
console.log("--- controller: res.render(index, newsObject)")
   // res.render("index", newsObject);
    //res.render("index", data); // note does not render

  // });
//})
  });
})*/
/*
//router.get("/articles", function(req, res) {
  console.log("--- controller: router.get / Article.find render index");
  db.Article.find({  }, function (err, data) {
    if (err) return handleError(err);
    
    var newsObject = {
    article: data
    }
    //prints all the data
//console.log("** controller: router.get / Article "+newsObject.article.title) 

    res.render("index", newsObject);

  // });
//})

  });
})
*/
// just added 
// scrape button does not work in / with this????
// but / shows button and handlebars render format
/*router.get("/", function(req, res) {
  console.log("--- controller: router.get / Article.find render index");
  db.Article.find({  }, function (err, data) {
    if (err) return handleError(err);
    
    var newsObject = {
    article: data
    }
    //prints all the data
//console.log("** controller: router.get / Article "+newsObject.article.title) 

    res.render("index", newsObject);

  // });
//})

  });
})*/
/*
router.get("/scrape",function(req,res){
   for (var i = 0; i < res.length; i++) {
    console.log("** controller: router.get /scrape "+res[i]._id+" "+res[i].title+" "+res[i].link)
   }
})
*/
//module.exports = function(app) {
/*
router.get("/",function(req,res) {
	//var Article = mongoose.model('Article', yourSchema);
 //console.log("** controller: router.get /articles res.length "+res.length+"\n"+JSON.stringify(res)); 
    
      for (var i = 0; i < res.length; i++) {
      // Display the information on the page
      console.log("** controller: router.get /articles "+res[i]._id+" "+res[i].title+" "+res[i].link)
  //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }

/*    var newsObject = {
    article: res
    }
console.log("** controller: router /articles "+newsObject.article) 
*/
 // res.redirect("/")
//    res.render("index", res);
// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
//Article.find({  }, function (err, articles) {
 // if (err) return handleError(err);
  // Prints
 // console.log("fetch app.get /articles "+articles) 
  //console.log('%s %s is a %s.', Article.title, person.name.last,
    //person.occupation);
//});



//})
