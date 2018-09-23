var config = {
  apiKey: "AIzaSyDoLAgXK4CMthjaXS47ibQ41C7WP47kuKo",
  authDomain: "rps-multiplayer-d079d.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-d079d.firebaseio.com",
  projectId: "rps-multiplayer-d079d",
  storageBucket: "rps-multiplayer-d079d.appspot.com",
  messagingSenderId: "56501077812"
};

firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {
  $(".player").on("click", function () {
    var p = $(this).attr("id");
    var divID = "#" + p + "div"
    $(divID).empty();
    var form = $("<form>");
    form.attr("id", "addName");
    var label = $("<label>");
    label.attr("for", "playerName");
    var input = $("<input>");
    input.attr("type", "text");
    input.attr("class", "playerName");
    input.attr("id", p);
    var button = $("<button>");
    button.attr("class", "go btn");
    button.attr("id", "go" + p);
    button.text("Go!");
    form.append(label, input, button);
    $(divID).append(form);
  });

  $(".go").on("click", function (event) {
    event.preventDefault();
    console.log("clicked");
    goID = $(this).attr("id");
    console.log(goID);
    if (goID === "gop1") {
      name = $("#p1").val();
      database.ref().set({
        p1: name,
      });
      //CHECK HERE HOW TO REFERENCE DB VALUES WITHOUT USING SNAPSHOT
      database.ref().on("value", function (snapshot) {
        var p1Name = snapshot.val().p1.name;
        console.log(p1Name);
        $("#p1div").empty();
        var h3 = $("<h3>")
        h3.text(p1Name);
        $("#p1div").append(h3);
      });
    } else {
      name = $("#p2").val();
      database.ref().set({
        p2: name,
      });
      database.ref().on("value", function (snapshot) {
        var p2Name = snapshot.val().p2.name;
        $("#p2div").empty();
        var h3 = $("<h3>")
        h3.text(p2Name);
        $("#p2div").append(h3);
      });
    }
  });

database.ref().on("value", function (snapshot) {
  //If both p1.name and p2.name are defined, start countdown to start game.


});




});