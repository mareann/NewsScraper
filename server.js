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
             //console.log("*** scrape result "+result)
             console.log("*** scrape: new dbArticle INSERT db "+dbArticle);
   //         articleArray.push({
   //           result
   //         });
            })
          }
        if (err) 
        {
          console.log("*** scrape: error "+err)
          //return handleError(err);
        }
      })
        .catch(function(err) {
          // If an error occurred, send it to the client
           console.log("*** server: app.get /scrape error "+err)
          return res.json(err);
        }); //end .catch
    
           // Save these results in an object to
      // push into the results array we defined earlier
 /*     console.log("*** server push result "+result.title)
      articleArray.push({
        result
      });
*/
    //test no change  result.render(dbArticle)
 
     // end db.find

     //console.log("*** server: app.get /scrape articleArray length "+articleArray.length)
      console.log("*** server: app.get /scrape res.json articleArray length "+articleArray.length)
      res.json(articleArray); //send to app.js
      //res.render("index",articleArray);

   
    }) // end div card__headline

        // })  // end each
 }) // end axios
   /*     .catch(function(err) {
          // If an error occurred, send it to the client
           console.log("*** server: app.get /scrape error "+err)
          return res.json(err);
        }); //end .catch */

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

// Route for grabbing a specific Headline by id, 
// populate it with it's note
//app.get("/headlines/:id", function(req, res) {

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
