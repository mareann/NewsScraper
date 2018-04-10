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
var routes = require("./controllers/news.js");
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

/* mongojs
request(url, function(error, response, html) {	
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  db.scrapedData.remove({ '' : '' });
  
  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors

  $("div .card__headline").each(function(i, element) {  
	  //console.log("element "+element)
    var link = url+$(element).children().attr("href");
    // var title = $(element).text();
    var title = [];
    
    title = $(element).attr("class","card__headline__text").text();

console.log("*** "+i+" link "+link+" ***")
console.log("*** "+" title "+title+" ***")
//console.log("*** "+" title "+title+" ***")
//console.log(title.length)
 
    // Save these results in an object to
    // push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });

    db.scrapedData.insert(results);

  }); // card__headline .each
}); // end request url
*/

// Main route (send collection)
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get(url).then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    //console.log("cheerio $",$)
    var articleArray = [];

    $("div .card__headline").each(function(i,element) {
      // Save an empty result object
      var result = {};

      result.title = $(this)
      .attr("class","card__headline__text")
      .text();
      result.link = url+$(this)
      .children("a").
      attr("href");

console.log("result "+result.title+" "+result.link)

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log("new dbArticle "+dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        }); //end .catch
           // Save these results in an object to
      // push into the results array we defined earlier
      articleArray.push({
        result
      });
    }); // end div card__headline
      console.log("articleArray length "+articleArray.length)
      res.json(articleArray);

  }) // end axios

  res.send("Scrape Complete!")
}) // end app.get

//app.get("/", function(req, res) {
//  var data = db.scrapedData;
//  res.send(data);
//});

// TODO: make two more routes

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    // Specify that we want to populate the retrieved libraries with any associated books
    .populate("note")
    .then(function(dbArticle) {
      console.log("app.get /articles")
//console.log("app.get /articles "+dbArticle)
      // If any found, send them to the client with any associated Books
      res.json(dbArticle);
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
/*app.get("/all", function(req, res) {
	//var data = db.scrapedData.find({});
	  db.scrapedData.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });

});*/
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
