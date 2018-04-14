/////////////////////////////////////////////////////////
// NewsScraper App
// server.js  Maryann Jordan
// web app that lets users view and leave comments 
// on the latest news. 
// Use Mongoose and Cheerio to scrape news from site
// then place the data in a MongoDB database. 
/////////////////////////////////////////////////////////
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

// Import routes and give the server access to them.
var routes = require("./controllers/news_controller.js");
app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper3");

var url = "https://www.huffingtonpost.com/"

// Make a request call to grab the HTML body from the site
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
      //console.log(i+" element "+element)
      result.title = $C(this)
      .attr("class","card__headline__text")
      .text();
      result.link = url+$C(this)
      .children("a").
      attr("href");

      console.log("*** server: app.get /scrape RESULT "+result.title+" "+result.link)
      console.log("*** server push RESULT "+(result.title).trim())
      articleArray.push({
        result
      });
      // Create a new Article using the `result` object built from scraping
      db.Article.find(
        {
          title: result.title
        },
        function(err,duplicate){

          if (duplicate.length)
            console.log("*** scrape: DUPLICATE in db "+duplicate)
          else
          {
            db.Article.create(result)
            .then(function(dbArticle) {
             // View the added result in the console
             console.log("*** scrape: new dbArticle INSERT db "+dbArticle);
            })
          }
        if (err) 
        {
          console.log("*** scrape: error "+err)
        }
      }) // end duplicate
        .catch(function(err) {
          // If an error occurred, send it to the client
           console.log("*** server: app.get /scrape error "+err)
          return res.json(err);
        }); //end .catch
   
      console.log("*** server: app.get /scrape res.json articleArray length "+articleArray.length)
      res.json(articleArray); //send to app.js

     }) // end axios
    }) // end div card__headline
  console.log("finished scrape");

}) // end app.get

// Route for getting all Articles from the db
  app.get("/", function(req, res) {
  // get all of the articles
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

app.get("/headlines/:id", function(req, res) {
  console.log("headlines id "+req.params.id)
  // find headline using the req.params.id,
  // and run the populate method with "note",
  // then responds with the headline with the note included
  db.Article.findOne({_id: req.params.id})
  .populate("note")
  .then(function(dbHeadline) {
    console.log("server headline "+dbHeadline)
    res.json(dbHeadline);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving/updating an Headline's associated Note
app.post("/headlines/:id", function(req, res) {
  // save the new note that gets posted to the Notes collection
  // then find an headline from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Headline.findOneAndUpdate({_id: req.params.id}, {$set: {note: dbNote._id}});
    })
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
