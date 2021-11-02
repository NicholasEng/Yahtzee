/*
* Title: Yahtzee
* Author: Nicholas Eng
* Date: 9/23/21
* Project Description: Replicate a game of Yahtzee
*/

/* Connect Dice class to UI */
import Dice from './Dice.js';
import Scorecard from './Scorecard.js';

/* Initialize Global Variables */
let myDice = new Dice();
let player = new Scorecard();
let locked = false;
let rollsLeft = 3;
window.myDice = myDice; //needed to run tests...

/* Add Event Listener */
document.getElementById('save-game').addEventListener('click', saveGame);
document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('load-game').addEventListener('click', loadGame);
document.getElementById('roll-dice').addEventListener('click', rollDice);

myDice.getDiceElements().forEach(function(die){
  die.addEventListener('dblclick', function(event){
    console.log("Event: " + event);
    console.log("Reserve toggled!");
    myDice.reserve(event.target);
  });
});

player.getCategoryElements().forEach(function(category){
  category.addEventListener('keypress', endTurn);
});

document.getElementById("rolls-remaining").innerHTML = rollsLeft; //Intializes the start roll

/* Functions */

/**
 * Attempts to end a turn
 *
 * @param {Object} event Important event info
 *
 */
function endTurn(event){
  //myDice.setDice([1,2,3,5,2]);
  if (!locked){
    //console.log("The categories are full: " + player.isFull());
    if (event.key == 'Enter' && rollsLeft !== 3){ //event.keyCode == '13'
      let element = event.target;
      let value = event.target.value;
      let valid = player.enterScore(element, value, myDice.getDiceArray());
      //Add a clear function for
      if (valid) {
        // console.log("Valid");
        feedback("good", "The score you entered is valid.");
        rollsLeft = 3;
        myDice.reset();
        document.getElementById("rolls-remaining").innerHTML = rollsLeft;
      } else {
        // console.log("invalid");
        feedback("bad", "The score you entered is not valid.");
      }
      if (player.isFull()){ //Check update totals for bonus
        //console.log("The categories are full: " + player.isFull());  //Add bonus
        feedback("info", "The game is over.");
      }
    }
  } else {
    feedback("info", "You cannot enter a score while the die are rolling.");
  }
}

function reserveDie(event){
  console.log("Reserve toggled!");
  //console.log("Event: " + event);
  myDice.reserve(event);
}

function saveGame(){
  //console.log(event.target);
  if (!locked) {
    console.log("Save game was clicked");
    let game = JSON.stringify(player.toObject());
    localStorage.setItem("Game#1", game);
    feedback("good", "Successfully saved game!");
  } else {
    console.log("Dice are rolling. You cannot save game at this time.");
  }
}

function loadGame(){
  //console.log(event.target);
  //console.log(player);
  console.log("Load game was clicked");
  if (!locked) {
    let currGame = localStorage.getItem("Game#1");
    if (currGame !== null) {
      player.loadScores(JSON.parse(currGame));
      myDice.reset();
      feedback("good", "Successfully loaded game!");
    } else if (currGame == null) {
      feedback("bad", "There is no game to load.");
    }
    console.log(currGame);
  } else {
    console.log("Dice are rolling. You cannot load game at this time.");
  }
}

function newGame(){
  //console.log(event.target);
  console.log("New game was clicked");
  if (!locked) {
    myDice.reset();
    player.reset();
    rollsLeft = 3;
    feedback("good", "Successfully started new game!");
    document.getElementById("rolls-remaining").innerHTML = rollsLeft;
  } else {
    console.log("Dice are rolling. You cannot start a new game at this time.");
  }
}

function rollDice(){
  //console.log(event.target);
  if (!locked && rollsLeft > 0) {
    locked = true;
    player.clearInputs();
    setTimeout(unlock, 2000); //2000 ms
    console.log("Roll dice was clicked");
    myDice.spin(event);
    //myDice.roll(event);
    feedback("good", "Successfully rolled.");
    rollsLeft--;
    document.getElementById("rolls-remaining").innerHTML = rollsLeft;
  } else if (rollsLeft == 0){
      feedback("bad", "Cannot roll more than 3 times.");
  }
}

function unlock () {
    locked = false;
    console.log("Dice array: " + myDice.getDiceArray());
    player.autoFillInputs(myDice.getDiceArray());// add the inputs
}

/**
 * Updates #feedback-content with an appropriate message and style.
 * If both msg and type are blank, #user-feedback becomes hidden
 *
 * @param {String} type A context (ie. "good"/"bad"/"info") for the feedback
 * @param {String} msg The message to display for the user
 *
 */
function feedback(type, msg) {
  let el = document.getElementById("feedback-content");
  let textBox = document.getElementById("feedback");
  textBox.classList.remove("hidden");
  el.classList.add(type);
  el.innerText = msg;
  setTimeout(function(){
    el.classList.remove(type);
    el.innerText = "";
    textBox.classList.add("hidden");
  }, 2000);
}
