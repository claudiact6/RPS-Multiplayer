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
$("#p1div").html("<img src='rock");
function playGame() {
  if (uid === p1uid) {
    $("#instructions").text("Choose your weapon:");
    $("#subinstructions").hide();
    $("#p1div").empty();
    var picsDiv = $("<div>");
    picsDiv.attr("class", "picsDiv row text-center");
    var rock = $("<img>")
    rock.attr("src", "assets/images/rock.png");
    rock.attr("id", "rock");
    var paper = $("<img>")
    paper.attr("src", "assets/images/paper.png");
    paper.attr("id", "paper");
    var scissors = $("<img>")
    scissors.attr("src", "assets/images/scissors.png");
    scissors.attr("id", "scissors");
    picsDiv.append(rock, paper, scissors);
    $("#p1div").append(picsDiv);
  } else if (uid === p2uid) {
    $("#instructions").text("Choose your weapon:");
    $("#subinstructions").hide();
    $("#p2div").empty();
    var picsDiv = $("<div>");
    picsDiv.attr("class", "picsDiv row text-center");
    var rock = $("<img>")
    rock.attr("src", "assets/images/rock.png");
    rock.attr("id", "rock");
    rock.attr("class", "img-fluid");
    var paper = $("<img>")
    paper.attr("src", "assets/images/paper.png");
    paper.attr("id", "paper");
    paper.attr("class", "img-fluid");
    var scissors = $("<img>")
    scissors.attr("src", "assets/images/scissors.png");
    scissors.attr("id", "scissors");
    scissors.attr("class", "img-fluid");
    picsDiv.append(rock, paper, scissors);
    $("#p2div").append(picsDiv);
  } else {
    $("#instructions").text("Players are picking their options");
    $("#subinstructions").hide();
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
        uid = user.uid;
        console.log("user id is: ", uid);
      } else {
        // User is signed out.
        // ...
      }
      // ...
    });
  }


  $(document).on("click", ".player", function () {
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
    if (snapshot.val().p1.button && snapshot.val().p2.button) {
      $("#p1div").empty();
      $("#p2div").empty();
      $("#winnerDiv").empty();
      $("#instructions").text("Let's get started!");
      $("#subinstructions").show();
      $("#p1div").append(snapshot.val().p1.button);
      $("#p2div").append(snapshot.val().p2.button);
    }
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
      playGame();
      //If both p1.choice and p2.choice are defined, show choices to audience & find the winner
      if (snapshot.val().p1.choice && snapshot.val().p2.choice) {
        //Assign choices to variables to make things simpler
        var p1choice = snapshot.val().p1.choice;
        var p2choice = snapshot.val().p2.choice;
        //Hide
        $("#instructions").text("And the results are...");
        //Show both players' choices to everyone
        $("#p1div").empty();
        $("#p1div").append(p1Name);
        var picsDiv1 = $("<div>");
        picsDiv1.attr("class", "picsDiv row text-center");
        var p1img = $("<img>")
        p1img.attr("src", "assets/images/" + p1choice + ".png");
        picsDiv1.append(p1img);
        $("#p1div").append(picsDiv1);
        $("#p2div").empty();
        $("#p2div").append(p2Name);
        var picsDiv2 = $("<div>");
        picsDiv2.attr("class", "picsDiv row text-center");
        var p2img = $("<img>")
        p2img.attr("src", "assets/images/" + p2choice + ".png");
        picsDiv2.append(p2img);
        $("#p2div").append(picsDiv2);
        //pick winner
        if (p1choice === "rock" && p2choice === "scissors") {
          $("#winner").text(p1Name + " wins!");
        } else if (p1choice === "scissors" && p2choice === "paper") {
          $("#winner").text(p1Name + " wins!");
        } else if (p1choice === "paper" && p2choice === "rock") {
          $("#winner").text(p1Name + " wins!");
        } else if (p1choice === p2choice) {
          $("#winner").text("It's a tie!");
        } else {
          console.log(p2Name + " wins!")
          $("#winner").text(p2Name + " wins!");
        }
        var reset = $("<button>");
        reset.attr("id", "reset");
        reset.attr("class", "btn");
        reset.text("Reset game");
        $("#winnerDiv").append(reset);
      }
    }

  });

  //Record player 1's choice 
  $(document).on("click", "#p1div img", function () {
    var choice = $(this).attr("id");
    console.log(choice);
    database.ref().update({
      p1: {
        name: name,
        uid: uid,
        choice: choice
      }
    });
    if (choice === "rock") {
      $("#scissors").hide();
      $("#paper").hide();
    } else if (choice === "paper") {
      $("#scissors").hide();
      $("#rock").hide();
    } else {
      $("#paper").hide();
      $("#rock").hide();
    }
  });

  //Record player 2's choice
  $(document).on("click", "#p2div img", function () {
    var choice = $(this).attr("id");
    console.log(choice);
    database.ref().update({
      p2: {
        name: name,
        uid: uid,
        choice: choice
      }
    });
    if (choice === "rock") {
      $("#scissors").hide();
      $("#paper").hide();
    } else if (choice === "paper") {
      $("#scissors").hide();
      $("#rock").hide();
    } else {
      $("#paper").hide();
      $("#rock").hide();
    }
  });

  $(document).on("click", "#reset", function () {
    database.ref().update({
      p1: {
        button: "<button id='p1' class='player btn'>Player 1</button>"
      },
      p2: {
        button: "<button id='p2' class='player btn'>Player 2</button>"
      }
    });

  })



});