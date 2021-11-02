/*
* Title: Yahtzee
* Author: Nicholas Eng
* Date: 9/23/21
* Project Description: Replicate a game of Yahtzee
*/

/* Connect Dice class to UI */
import Dice from './Dice.js';

/* Initialize Global Variables */
let myDice = new Dice();
let rollsLeft = 3;
let diceArray = [0,0,0,0,0];
let img = ['one', 'two', 'three', 'four', 'five', 'six'];
let reserveBool;
let rollingDie;

/* Add Event Listener */
document.getElementById('save-game').addEventListener('click', saveGame);
document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('load-game').addEventListener('click', loadGame);
document.getElementById('roll-dice').addEventListener('click', rollDice);

for (let i = 0; i < 5; i++) {
  document.getElementById('die-' + i).addEventListener('dblclick', reserveDie); //Add an event listener to each die
}

document.getElementById("rolls-remaining").innerHTML = rollsLeft; //Intializes the start roll

/* Functions */
function reserveDie(){
  console.log("Reserve toggled!");
  event.target.classList.toggle("reserved");
}

function resetDice(){ //Resets the dice to 0's
  for (let i = 0; i < diceArray.length; i++) {
    rollingDie = document.getElementById("die-" + i);
    reserveBool = rollingDie.classList.contains("reserved");
    if (reserveBool) {
      rollingDie.classList.toggle("reserved"); //remove the reserved class
    }
    diceArray[i] = 0;
  }
}

function saveGame(){
  //console.log(event.target);
  console.log("Save game was clicked");
  localStorage.setItem("Yahtzee", "Test");
}

function loadGame(){
  //console.log(event.target);
  console.log("Load game was clicked");
  console.log(localStorage.getItem("Yahtzee"));
  for (let i = 0; i < diceArray.length; i++) {
    console.log(diceArray[i]);
  }
}

function newGame(){
  //console.log(event.target);
  resetDice();
  rollsLeft = 3;
  document.getElementById("rolls-remaining").innerHTML = rollsLeft;
  console.log("New game was clicked");

  for (let i = 0; i < 5; i++) {
    document.getElementById("die-" + i).setAttribute('src', "images/blank.svg");
  }
}

function rollDice(event){
  console.log(event.target);
  console.log("Roll dice was clicked");

  for (let i = 0; i < diceArray.length; i++) {
    rollingDie = document.getElementById("die-" + i); //this is also event.target.id
    reserveBool = rollingDie.classList.contains("reserved");
    console.log(reserveBool);
    if (!reserveBool) {
      let a = Math.floor(Math.random() * (5 - 0 + 1)) + 0; //generates the random numbers
      document.getElementById("die-" + i).setAttribute('src', "images/" + img[a] + ".svg");
      diceArray[i] = a+1;
    }
  }

  rollsLeft--;
  document.getElementById("rolls-remaining").innerHTML = rollsLeft;
}
