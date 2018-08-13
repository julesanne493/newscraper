// $(document).on("click", "#newScrape", function(){

//   $.getJSON("/articles", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#articles").append("<div class = 'card'> <div class='card-body'><h3><a class='card-title' href=" + data[i].link + " data-id='" + data[i]._id + "'>" + data[i].title + "</a></h3><p class='card-text'>" + data[i].summary + "</p> <button class='btn btn-primary addNote' data-id='" + data[i]._id + "'>View Comments</div></div>")
//     }
//   });

// });

$(document).on("click", "#oldScrape", function(){

  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class = 'card'> <div class='card-body'><h3><a class='card-title' href=" + data[i].link + " data-id='" + data[i]._id + "'>" + data[i].title + "</a></h3><p class='card-text'>" + data[i].summary + "</p> <button class='btn btn-primary addNote' data-id='" + data[i]._id + "'>View Comments</div></div>")
    }
  });

});

$(document).on("click", ".addNote", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function(data) {
      console.log(data);

      

      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' >");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' class='savenote'>Save Note</button>");

      if (data.note) {

        $("#titleinput").attr(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});



$(document).on("click", ".saveNote", function() {
  
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      title: $("#titleinput").val(),

      body: $("#bodyinput").val()
    }
  })

    .then(function(data) {

      console.log(data);
    });

});
