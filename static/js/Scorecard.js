class Scorecard {
  #totalElements;
  #categoryElements;
  #upperCategories;

  constructor(){
    this.#categoryElements = Array.from(document.getElementsByClassName("score"));
    this.#totalElements = Array.from(document.getElementsByClassName("total"));
    this.#upperCategories = ['one', 'two', 'three', 'four', 'five', 'six'];
  }

  /**
   * Attempts to enter a score for a particular category
   * If a score is valid for a particular category (using the given dice roll)
   *   the score is entered, totals are recalculated, and the category  is disabled.
   * If a score is invalid, the bad score is removed
   *
   * @param {Object} element the input element for a particular category
   * @param {Number} value the proposed score for the category
   * @param {Object} diceArray an array of integer values indicating the current roll
   * @return {Boolean} a Boolean value indicating whether the score is valid for the category
   */
  enterScore(element, value, diceArray){
    //console.log(this.#categoryElements);
    //console.log(element);
    if (this.#validateScore(element.id, value, diceArray)) {
      //console.log("Category " + element.id + " set to " + value + ".");
      //Set the value of the category Element
      element.setAttribute("disabled", false);
      //element.classList.toggle("disabled"); //class for css
      this.#updateTotals();
      return true;
    }
    else {
      return false;
    }
  }

  getCategoryElements(){
    return this.#categoryElements.slice();
  }

  /**
   * Determines whether the scorecard is full
   * A full scorecard is a scorecard where all categores are disabled.
   *
   * @return {Boolean} a Boolean value indicating whether the scorecard is full
   */
  isFull(){
    let scoreElement = this.#categoryElements;
    let totalDisabled = scoreElement.reduce(function(total, currEl, index, arr){
      if (currEl.hasAttribute("disabled")){
        total++;
      }
      return total;
    }, 0);

    if (totalDisabled == scoreElement.length) { //length is 13
      return true;
    } else {
      return false;
    }
  }

  /**
   * Resets the scorecard for a new game
   *   -Scores are removed from all categories
   *   -No categories are disabled
   *
   */
  reset(){
    let scoreEl = this.#categoryElements;
    scoreEl.forEach(function(score){
      score.removeAttribute("disabled");
      score.value = "";
    })

    this.#totalElements.forEach(function(total) {
      total.innerText = "";
    })

    //element.setAttribute("editable", true);
  }

  /**
   * Loads scores from a JS object
   *
   * @param {Object} objectVersion the object version of the scorecard
   *
   */
  loadScores(objectVersion){
    this.#categoryElements.forEach(scoreElement => {
      scoreElement.value = objectVersion[scoreElement.id];
      if (objectVersion[scoreElement.id] != ""){
        scoreElement.setAttribute("disabled", true);
      }
    })
    this.#totalElements.forEach(totalElement => {
      totalElement.innerText = objectVersion[totalElement.id];
    })
  }

  /**
   * Creates a JS object from the scorecard
   *
   * @return {Object} an object version of the scorecard
   *
   */
  toObject(){
    let game = {};
    this.#categoryElements.forEach(scoreElement => {
      game[scoreElement.id] = scoreElement.value;
    })
    this.#totalElements.forEach(totalElement => {
      game[totalElement.id] = totalElement.innerText;
    })
    console.log(game);
    return(game);
  }

  autoFillInputs(diceArray){
    let inputMap = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6};
    let totalInput = diceArray.reduce(function(totalValue, currValue){
      totalValue[currValue] += currValue;
      return totalValue;
    }, {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
    this.#categoryElements.forEach(function(scoreInput) {
      if(inputMap[scoreInput.id] != null) {
        scoreInput.value = totalInput[inputMap[scoreInput.id]];
      }
    });
  }

  clearInputs(){
    this.#categoryElements.forEach(function(scoreElement){
      if (!scoreElement.hasAttribute("disabled")) {
        scoreElement.value = "";
      }
    })
  }

  /**
   * Validates a score for a particular category
   *
   * @param {String} id the category id
   * @param {Number} value the proposed score for the category
   * @param {Object} diceArray an array of integer values indicating the current roll
   * @return {Boolean} a Boolean value indicating whether the score is valid for the category
   */
  #validateScore(id, value, diceArray){
    let validInput = false;
    let diceIDs = { one: 1, two: 2, three: 3, four: 4, five : 5, six : 6};
    let upperScore;
    console.log("In validateScore =============================");
    let diceCount = diceArray.reduce(function(totalValue, currValue){
      totalValue[currValue]++;
      return totalValue;
    }, {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});

    let diceTotal = diceArray.reduce(function(total, curr) {
      return total + curr;
    }, 0);

    let oneCount = Object.values(diceCount).reduce(function(total, curr) {
      return curr == 1 ? total + 1 : total;
    }, 0);

    console.log("diceCount: " + JSON.stringify(diceCount));
    if(diceIDs[id]) {
      upperScore = diceArray.reduce(function(total, curr){
        return curr == diceIDs[id] ? total + curr: total;
      }, 0);
      if(value == upperScore) {
        validInput = true;
      }
    }
    console.log("upperScore: " + upperScore);
    if (id == "3-of-a-kind" && Object.values(diceCount).includes(3)){
      if(diceTotal == value) {
        validInput = true;
      }
    }
    if (id == "4-of-a-kind" && Object.values(diceCount).includes(4)){
      if(diceTotal == value) {
        validInput = true;
      }
    }
    if (id == "full-house" && Object.values(diceCount).includes(3) && Object.values(diceCount).includes(2)){
      if(value == 25) {
        validInput = true;
      }
    }

    if(id == "small-straight" && oneCount == 5 && diceCount[3] == 1 && diceCount[4] == 1) {
      if(value == 30) {
        validInput = true;
      }
    }

    if(id == "large-straight" && oneCount == 5 && (diceCount[1] == 0 || diceCount[6] == 0)) {
      if(value == 40) {
        validInput = true;
      }
    }



    if (id == "Yahtzee" && Object.values(diceCount).includes(5)){
      if(value == 50) {
        validInput = true;
      }
    }

    if (id == "chance" && diceTotal == value){
      validInput = true;
    }
    console.log("Out validateScore =============================");

    if (validInput){
      console.log("Score is valid.");
    } else {
      console.log("Score is not valid.")
    }
    return validInput;
  }

  /**
   * Updates both the upper and lower totals
   *
   */
  #updateTotals(){ //remove the paramters

    //Take the values from upper score and lower score

    let total = document.getElementById("upper-total");
    let bonus = document.getElementById("upper-bonus");
    let totalScore = document.getElementById("upper-section-total");
    let lowerTotal = document.getElementById("lower-total");
    let upperTotal = document.getElementById("upper-section-total-lower");
    let grand = document.getElementById("grand-total");

    let totalValue = 0;
    let bonusValue = 0;
    let totalScoreValue = 0;
    let lowerTotalValue = 0;
    let upperTotalValue = 0;
    let grandValue = 0;

    this.#categoryElements.forEach((element) => {
      if(element.hasAttribute("disabled")) {
        if(element.classList.contains("upper")) {
          totalValue += parseInt(element.value);
        } else {
          lowerTotalValue += parseInt(element.value);
        }
      }
    });

    bonusValue = totalValue > 63 ? 35 : 0;
    totalScoreValue = totalValue + bonusValue;
    upperTotalValue = totalScoreValue;
    grandValue = lowerTotalValue + upperTotalValue;

    total.innerText = totalValue ? totalValue : "";
    bonus.innerText = bonusValue ? bonusValue : "";
    totalScore.innerText = totalScoreValue ? totalScoreValue : "";
    lowerTotal.innerText = lowerTotalValue ? lowerTotalValue : "";
    upperTotal.innerText = upperTotalValue ? upperTotalValue : "";
    grand.innerText = grandValue ? grandValue : "";

    console.log(this.#totalElements);
  }

}//Scorecard class

export default Scorecard;
