class Dice {
  #diceLabels;
  #diceElements;
  #diceArray;
  #diceLabelSpin;

  //rollsLeft;

  /**
   * The Dice class constructor
   * Initializes:
   * - this.#diceLabels as an array with picture labels
   * - this.#diceElements as an array of HTML elements with an <img> tag for each die
   * - this.#diceArray as a an array with five 0 elements
   */
  constructor() {
    this.#diceLabels = ['blank', 'one', 'two', 'three', 'four', 'five', 'six'];
    this.#diceElements = Array.from(document.getElementsByClassName("die"));
    this.#diceLabelSpin = ['spinning_one', 'spinning_two', 'spinning_three', 'spinning_four', 'spinning_five', 'spinning_six'];
    this.#diceArray = [0, 0, 0, 0, 0];
  }

  /**
   * Returns an array of HTML image tags representing
   * a current view of all five Yahtzee dice
   */
  getDiceElements() {
    return this.#diceElements.slice();
  }

  /**
   * Returns an array of integers representing
   * a current view of all five Yahtzee dice
   * A natural mapping is used to pair each integer with a die picture
   * Dice values: 0 for blank, or 1 - 6
   */
  getDiceArray() {
    return this.#diceArray.slice();
  }

  /**
   * Resets all dice pictures to blank, and unreserved
   * Resets diceArray to all 0's
   */
  reset() {
    console.log("Resetting the dice");
    let diceElements = this.getDiceElements();
    for (let i = 0; i < diceElements.length; i++) {
      let currDie = diceElements[i];
      let reserveBool = currDie.classList.contains("reserved");

      if (reserveBool) {
        currDie.classList.toggle("reserved"); //remove the reserved class
      }
      this.#setDie(this.#diceElements[i], 0);
      //this.#diceElements[i].setAttribute('src', "images/blank.svg");
    }
    //rollsLeft = 3;
  }//reset()


  /**
   * Performs all necessary actions to roll and update display of dice
   * Changes src to reflect new value
   * Updates this.#diceArray
   */
  roll() {
    console.log("Rolling the dice");
    this.#noReserve();
    let diceElements = this.getDiceElements();
    for (let i = 0; i < diceElements.length; i++) {
      let reserveBool = diceElements[i].classList.contains("reserved");
      console.log(reserveBool);
      if (!reserveBool) {
        let a = Math.floor(Math.random() * (6)) + 1; //generates the random numbers
        this.#setDie(diceElements[i], a);
      }
    }
    //rollsLeft--;
  }//roll()

  spin() {
    let runTime = 1000; // Total spin animation time 1000 ms
    let that = this; // Initialize this in this scope to use in the setInterval callback function
    // Use setInterval to trigger a different dice spin every 200ms
    that.#noReserve();
    let intervalID = setInterval(function() {
      if(runTime <= 0) { // Execute the actual dice roll if roll time is over
        clearInterval(intervalID);
        that.roll();
      }
      else {
        runTime -= 200; // Decreament the runTime counter by 200ms
        let diceElements = that.getDiceElements();
        for (let i = 0; i < diceElements.length; i++) { // Loop through each dice element and change it to a random dice spin image
          let a = Math.floor(Math.random() * (6)); //generates the random numbers for rolling animation
          that.#setSpinningDie(diceElements[i], a);
        }
      }
    }, 300); //300
    console.log("Spinning");
  }

  /**
   * Performs all necessary actions to reserve/unreserve a particular die
   * Adds "reserved" as a class label to indicate a die is reserved
   * Removes "reserved" a class label if a die is already reserved
   *
   * @param {Object} element the <img> element representing the die to reserve
   */
  reserve(event) {
    let diceElements = this.getDiceElements();
    for (let i = 0; i < diceElements.length; i++) {
      let reserveBool = diceElements[i].classList.contains("noReserve");
      let dieValue = this.#diceArray[i];
      if (!reserveBool && dieValue > 0) {
        console.log("Reserving " + event.id);
        event.classList.toggle("reserved");
      }
      else {
        console.log("Cannot reserve " + event.id + " at this time.");
      }
    }
    // console.log("Reserving " + event.target.id);
    // event.target.classList.toggle("reserved");
  }//reserve()

  /**
   * Sets die picture to a specific roll value, including blank or spinning
   * Private- Internal use in dice.js only
   * Updates both the picture of the die and its integer value in diceArray
   *
   * @param {Object} element the <img> element representing the die to set
   * @param {int} newValue the new value of the die: 0 for blank or 1 - 6
   */
  #setDie(element, newValue) {
    let dieIndex = element.id.split("die-")[1]; //finds the number id for each dice. Split retuns an array
    element.setAttribute('src', `images/${this.#diceLabels[newValue]}.svg`);
    this.#diceArray[dieIndex] = newValue;
    console.log(this.#diceArray);
  }//setDie()

  /**
   * A useful testing method to conveniently change dice
   * Repeatedly calls this.#setDie
   *
   * @param {Array} newDiceArray an array of integers
   */
  setDice(newDiceArray){
    let elements = this.getDiceElements();
    //console.log("Elements " + elements);
    newDiceArray.forEach(function(dieValue, index){
      // console.log("Die Value " + dieValue);
      // console.log("Index " + elements[index]);
      // debugger;
      this.#setDie(elements[index], dieValue);
    }.bind(this));
    console.log("You cheater.");
  }


  #setSpinningDie(element, newValue) {
    let dieIndex = element.id.split("die-")[1];
    let diceElements = this.getDiceElements();
    let reserveBool = diceElements[dieIndex].classList.contains("reserved");
    if (!reserveBool) {
      element.setAttribute('src', `images/${this.#diceLabelSpin[newValue]}.svg`);
    }
  }

  #noReserve(){
    let diceElements = this.getDiceElements();
    for (let i = 0; i < diceElements.length; i++) {
      diceElements[i].classList.toggle("noReserve");
    }
  }

}//Dice class

export default Dice;
