/////////////////////////////////////////////////////////
// assets/javascript/app.js Maryann Jordan
// on click and on submit functions
// notes
// console.log app.js 
// GET /scrape 304 5.624 ms - -
// server: ** app.get /articles
// GET /articles 304 22.389 ms - -
// server: app.get /scrape articleArray length 32
/////////////////////////////////////////////////////////
// Make sure we wait to attach our handlers until the DOM is fully loaded.
console.log("in app.js")
$(function() {

$("#scrapeButton").on("click", function(){
  console.log("#scrapeButton click")

  $.ajax({
    type: "GET",
    url: "/scrape"
  })
  .done(function(data){
    console.log("app: ajax scrapeButton data length "+data.length)
    // Grab the articles as a json
    $.getJSON("/", function(data) {
      console.log("-- app: getJSON /scrape scrapeButton data.length "+data.length+" data "+JSON.stringify(data))    
    }) // end getJSON      
  }) // end done 

}); // end scrapeButton

// Whenever someone clicks tag
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

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
     url: "/headlines/"+thisId,
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
  var thisId = $(this).attr("data-id");

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