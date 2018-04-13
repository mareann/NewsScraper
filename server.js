// web app that lets users view and leave comments 
// on the latest news. 
// Use Mongoose and Cheerio to scrape news from site
// then place the data in a MongoDB database. 

// Dependencies
var express = require("express");
//var mongojs = require("mongojs");
var logger = require("morgan");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
//var uniqueValidator = require("mongoose-unique-validator");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");
// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

//require("./controllers/fetch.js")(app);
// Import routes and give the server access to them.
var routes = require("./controllers/news_controller.js");
app.use(routes);

// Database configuration
var databaseUrl = "scraper3";
var collections = ["scrapedData"];

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper3");

// Hook mongojs configuration to the db variable
//var db = mongojs(databaseUrl, collections);
//db.on("error", function(error) {
//  console.log("Database Error:", error);
//});

var url = "https://www.huffingtonpost.com/"
// Make a request call to grab the HTML body from the site

// Main route (send collection)
// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get(url).then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $C = cheerio.load(response.data);
    //console.log("cheerio $",$)
    var articleArray = [];

    $C("div .card__headline").each(function(i,element) {
      // Save an empty result object
      var result = {};

      result.title = $C(this)
      .attr("class","card__headline__text")
      .text();
      result.link = url+$C(this)
      .children("a").
      attr("href");

      // console.log("app.get /scrape result "+result.title+" "+result.link)

      // Create a new Article using the `result` object built from scraping
      db.Article.find({title:result.title},function(err,duplicate){
        if (err) 
          console.log(err)
        if (duplicate.length)
          console.log("duplicate "+duplicate)
        else
        {
 
          db.Article.create(result)
            .then(function(dbArticle) {
                 // View the added result in the console
             console.log("*** scrape result "+result)
             console.log("*** scrape: new dbArticle "+dbArticle);
            articleArray.push({
              result
            });
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
           console.log("*** server: app.get /scrape error "+err)
          return res.json(err);
        }); //end .catch
           // Save these results in an object to
      // push into the results array we defined earlier
  //moved up    articleArray.push({
  //      result
  //    });
    //test no change  result.render(dbArticle)
    } // end div card__headline
}) // end db.find

     //console.log("*** server: app.get /scrape articleArray length "+articleArray.length)
      console.log("*** server: app.get /scrape res.json articleArray length "+articleArray.length)
      res.json(articleArray); //send to app.js
   })  // end each
 }) // end axios
//test no change res.render("index", res)
 // res.send("Scrape Complete!")
  console.log("finished scrape");
  //res.redirect("/");
}) // end app.get

/*
app.get("/", function(req, res) {
    db.Article.find({}).then(function(Article) {
        res.render("index", res) // { articles : Article }); 
    }).catch(function(error) {
        console.log(error)
    });
});
*/



// Route for getting all Articles from the db
//app.get("/articles", function(req, res) {
  app.get("/", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    // Specify that we want to populate the retrieved libraries with notes
    .populate("note")
    .then(function(dbArticle) {
      console.log("server: ** app.get /articles dbArticle.length "+dbArticle.length)
      //console.log("app.get /articles "+dbArticle)
      // If any found, send them to the client with notes
      // note does not render
console.log("server: ** app.get / res.render(index, dbArticle)");
      res.render("index", dbArticle);  //{ articles : Article }); 
      //res.json(dbArticle);

    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});
// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
