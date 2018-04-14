/////////////////////////////////////////////////////////
// assets/js/burger.js
// on click and on submit functions
// notes
// console.log app.js:19 scrapeButton 
// GET /scrape 304 5.624 ms - -
// server: ** app.get /articles
// GET /articles 304 22.389 ms - -
// server: app.get /scrape articleArray length 32
/////////////////////////////////////////////////////////
// Make sure we wait to attach our handlers until the DOM is fully loaded.
console.log("in app.js")
$(function() {
/*
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    if (i==0 )
      console.log("app: getJSON /articles "+data[i].title)
    // Display the apropos information on the page
  //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
//do we need?  data.render("index", data) //newsObject);

});
*/
// Grab the headlines as a json
/*
$.getJSON("/headlines", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#headlines").append("<p data-id='" + data[i]._id + "'>" + "<a href=" + data[i].link + ">" +  data[i].title + "</a>" + "<br />" + data[i].summary + "</p>" + "<hr>");
  }
});
*/
console.log("before #scrapeButton")
$("#scrapeButton").on("click", function(){
    // event.preventDefault();
    console.log("#scrapeButton click")

  $.ajax({
    type: "GET",
    url: "/scrape"
    //error: handleError
  })
  //.error(console.log(err) )
  .done(function(data){

    console.log("app: ajax scrapeButton data length "+data.length)

/*
    $.getJSON("/",function(data){
      console.log("-- app: getJSON / scrapeButton data.length "+data.length+" data "+JSON.stringify(data))
    })
*/
    // Grab the articles as a json

    $.getJSON("/scrape", function(data) {
      // For each one
     // if ( data.length) {
      //  $("#newsArticles").empty();
      //  $("#articles").empty();
     // }
      console.log("-- app: getJSON /scrape scrapeButton data.length "+data.length+" data "+JSON.stringify(data)) //+articles)
  //res.render("index", { articles : Article });      
 /*     for (var i = 0; i < data.length; i++) {
      // Display the information on the page
        if ( i == 0)
          console.log("-- app: scrapeButton getJSON / "+data[i]._id+" "+data[i].title+" "+data[i].link)
 
 // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
*/
 //   var newsObject = {
 //      title: data.title,
 //      link: data.link
 //   }
    // Uncaught TypeError: data.render is not a function
    //  data.render("index", newsObject);
      
    }) // end getJSON
    //.fail({console.log(error)}))

 //data.redirect("/") //data.redirect is not a function
    
    
  }) // end done 

}); // end scrapeButton


// Grab the articles as a json
/*$.getJSON("/articles", function(data) {
  // For each one
console.log("getJSON /articles ")
// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
//db.Article.find({  }, function (err, articles) {
//  if (err) return handleError(err);
  // Prints
console.log("app: getJSON /articles ") 
    var newsObject = {
    article: data
    }
  data.render("index", newsObject);
  //console.log('%s %s is a %s.', Article.title, person.name.last,
    //person.occupation);
//});
   // res.render("index", data);
 // for (var i = 0; i < data.length; i++) {
 //    console.log("*** /articles data.title "+data[i].title)
    // Display the apropos information on the page
 //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
 // }
});
})*/
 // Now make an ajax call for the Article
/*  $.ajax({
    method: "GET",
    url: "/articles/"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("ajax data "+data);
      res.render("index", data);
    })
*/
// Whenever someone clicks a p tag
$(document).on("click", ".commentButton", function() {
  // Empty the notes from the note section
 // $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id")
  //$(this).id//$(this).attr("data-id");
console.log("app: click id "+thisId)
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/headlines/"+thisId
   // url: "/articles/" + thisId
  })
    // add the note information to the page
    .then(function(data) {
  console.log("app: ajax /headlines note is "+JSON.stringify(data)); //prints out html????
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  console.log("click savenote id "+thisId)
//var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
     url: "/headlines/"+thisId,
   // url: "/articles/" + thisId
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
// savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id 
  var thisId = $(this).attr("id");

  // Run a POST request to update
  $.ajax({
    method: "POST",
    url: "/headlines/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log("app savenote "+data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
}) //end function