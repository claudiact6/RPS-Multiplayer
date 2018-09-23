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
var uid = "";

$(document).ready(function () {
  var user = firebase.auth().getCurrentUser;
  if (user != null) {
    uid = user.uid;
    console.log(uid);
  } else {
    firebase.auth().signInAnonymously().catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        uid = user.uid;
        console.log("user id is: ", uid);
      } else {
        // User is signed out.
        // ...
      }
      // ...
    });
  }


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

  $(document).on("click", ".go", function (event) {
    event.preventDefault();
    console.log("clicked");
    goID = $(this).attr("id");
    console.log(goID);
    if (goID === "gop1") {
      name = $("#p1").val();
      database.ref().update({
        p1: {
          name: name,
          uid: uid
        }
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
      database.ref().update({
        p2: {
          name: name,
          uid: uid
        }
      });
      database.ref().on("value", function (snapshot) {
        var p2Name = snapshot.val().p2.name;
        console.log(p2Name);
        $("#p2div").empty();
        var h3 = $("<h3>")
        h3.text(p2Name);
        $("#p2div").append(h3);
      });
    }
  });

  database.ref().on("value", function (snapshot) {
    //If both p1.name and p2.name are defined, start countdown to start game.
    if (snapshot.val().p1.name && snapshot.val().p2.name) {
      console.log("Both are defined");
    }

  });




});