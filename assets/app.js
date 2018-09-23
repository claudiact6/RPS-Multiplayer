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
var p1Name = "";
var p2Name = "";
var p1uid = "";
var p2uid = "";

function updateP1Div() {
  $("#p1div").empty();
  var h3 = $("<h3>")
  h3.text(p1Name);
  $("#p1div").append(h3);
}

function updateP2Div() {
  $("#p2div").empty();
  var h3 = $("<h3>")
  h3.text(p2Name);
  $("#p2div").append(h3);
}

function updateDivs() {
  updateP1Div();
  updateP2Div();
}

function playGame() {
  if(uid === p1uid) {
    $("#p1div").text("Omg! You're player 1!");
  } else if (uid === p2uid) {
    $("#p2div").text("Omg! Hi player 2!");
  } else {
    $("#p1div").text("Players are picking their option");
  }
}

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

  //This is for people who show up to the page once the action has already started: they should see the names and stuff
/*   database.ref().once('value').then(function (snapshot) {
    if (snapshot.val().p1.name && snapshot.val().p2.name) {
      console.log(" starting game, Both are defined");
      p1Name = snapshot.val().p1.name;
      p2Name = snapshot.val().p2.name;
      updateDivs();
    };
  }); */


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
    goID = $(this).attr("id");
    if (goID === "gop1") {
      name = $("#p1").val();
      database.ref().update({
        p1: {
          name: name,
          uid: uid
        }
      });
    } else {
      name = $("#p2").val();
      database.ref().update({
        p2: {
          name: name,
          uid: uid
        }
      });
    }
  });

  database.ref().on("value", function (snapshot) {
    if (snapshot.val().p1.name) {
      p1Name = snapshot.val().p1.name;
      p1uid = snapshot.val().p1.uid;
      updateP1Div();
    }
    if (snapshot.val().p2.name) {
      p2Name = snapshot.val().p2.name;
      p2uid = snapshot.val().p2.uid;
      updateP2Div();
    }
    //If both p1.name and p2.name are defined, start countdown to start game.
    if (snapshot.val().p1.name && snapshot.val().p2.name) {
      console.log("Both are defined");
      playGame();
    }

  });

  $("#reset").on("click", function () {
    database.ref().update({
      p1: {
        name: null,
      },
      p2: {
        name: null,
      }
    });
  })



});