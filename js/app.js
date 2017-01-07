
/*
Build a Movie Search App with the OMDb API

This application will let you enter a title, to search a movie.
It will then return a list of movies, depending on your search.
You can also click on each movies, to view more information about it.
*/

//"list" will contain the response from the Omdb API, in Json format, and "currentmovie" will contain the index of the selected movie.

var list;
var currentmovie;

//On ready, and on submit events, it will catch the inputs, to send an AJAX request to the Omdb API
$(document).ready(function () {
  $(".search-form").submit(function(e) {
    
    //prevent from submitting the form
    e.preventDefault();
    
    //catch the inputs
    var search = $("#search").val();
    var year = $("#year").val();
  
    //here is the url, the data, and the callback function for the AJAX request
    var url = "http://www.omdbapi.com/?";
    var data = {
      s : search,
      y : year,
      r : "json",
      plot : "full"
    };
    
    function callbackfunction(data) {
      list = data;
      print();
    } 
    

    //This function is the main part and will create a HTML list of movies returned by the Omdb API. It will then print it to the page.
    function print() {
      var HTML = "";
      if (list.Response === "False") {
        HTML = "<li class='no-movies desc'><i class='material-icons icn-movie'>help_outline</i>No movies found that match: ";
        HTML += search;
        HTML += ". Please try another keyword.</li>";
      } else {
      $.each(list.Search, function(i, data) {
        HTML += '<li class="list"><div class="poster-wrap">';
        if(data.Poster === "N/A") {
          HTML += '<i class="material-icons poster-placeholder">crop_original</i>';
        } else {
          HTML += '<img class="movie-poster" src="';
          HTML += data.Poster;
          HTML += '">';
        }
          HTML += '</div><span class="movie-title">';
          HTML += data.Title;
          HTML += '</span><span class="movie-year">';
          HTML += data.Year;
          HTML += '</span></li>';
        });
      }
      $("#movies").html(HTML);
      $(".main-content").removeClass('is-hidden');
      $("#description").addClass('is-hidden');
    }
    
    //On fail, it will show an error
    $.getJSON(url,data,callbackfunction).fail(function() {
      var text = "<li class='desc'><i class='material-icons icn-movie'>error</i>Sorry, an error as occured. Please try again</li>";
      $("#movies").html(text);
    });
  });
});


//This is another AJAX request, for the page description
function description() {
  var id = list.Search[currentmovie].imdbID;
  var url = "http://www.omdbapi.com/?";
  var data = {
    i :id,
    plot : "full",
    r : "jon"
  };
  //This callback function will add the informations of the selected movie, to the page description
  function printdescription(data) {
    if(data.Poster === "N/A") {
        $(".description-image").attr("src", 'examples/no_picture.png');
    } else {
        $(".description-image").attr("src", data.Poster);
    }
      $(".description-title").text(data.Title + " (" + data.Year + ")");
      $(".description-rating").text("Imdb Rating : " + data.imdbRating);
      $(".description-plot").text(data.Plot);
      $(".description-a").attr("href", "http://www.imdb.com/title/" + data.imdbID);
      $(".main-content").addClass('is-hidden');
      $("#description").removeClass('is-hidden');
    }
  $.getJSON(url,data,printdescription);
}

//This event is called when a movie is selected, to show more informations about it: it will change the "currentmovie" variable, and call the "description" AJAX request
$(".movie-list").on("click",".list",function() {
  currentmovie = $(this).index();
  description();
});

//This function will make a way back to the search page, when the "back" button is pressed
$("#description").on("click",".description-back",function() {
  $(".main-content").removeClass('is-hidden');
  $("#description").addClass('is-hidden');
});

//This will help the user to access the next or previous movie, directly from the page description.
$(".button").on("click", "button", function() {
  if(currentmovie <= 0 && $(this).val() === "-1") {
    alert("There is no other movies before this one!");
  } else if( currentmovie >= list.Search.length-1 && $(this).val() === "1") {
    alert("There is no other movies after this one!");
  } else {
    currentmovie += parseInt($(this).val());
    description();
  }
});

