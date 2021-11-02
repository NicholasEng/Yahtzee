const puppeteer = require('puppeteer');
const tools = require('./utils');

const tests={
  "one" : [
    [0, [6, 2, 3, 4, 5], true],
    [1,[1, 2, 3, 4, 5], true],
    [2,[1, 2, 3, 1, 5], true],
    [3,[1, 2, 1, 1, 5], true],
    [4,[1, 2, 1, 1, 1], true],
    [5,[1, 1, 1, 1, 1], true],
    [-4, [1, 2, 3, 4, 5], false],
    [4, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["four", [1, 2, 1, 1, 1], false]
  ],
  "two":[
    [0,[6, 1, 3, 4, 5],true],
    [2,[1, 2, 3, 4, 5],true],
    [4,[1, 2, 3, 2, 5],true],
    [6,[1, 2, 2, 2, 5],true],
    [8,[2, 2, 2, 2, 1],true],
    [10,[2, 2, 2, 2, 2],true],
    [4, [1, 2, 3, 4, 5], false],
    [-4, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["two", [1, 2, 1, 1, 1], false]
  ],
  "three":[
    [0,[6, 1, 2, 4, 5],true],
    [3,[1, 2, 3, 4, 5],true],
    [6,[1, 2, 3, 3, 5],true],
    [9,[3, 2, 3, 2, 3],true],
    [12,[3, 2, 3, 3, 3],true],
    [15,[3, 3, 3, 3, 3],true],
    [4, [1, 2, 3, 4, 5], false],
    [-4, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["three", [1, 2, 3, 1, 1], false]
  ],
  "four":[
    [0,[2, 3, 5, 6, 1],true],
    [4,[1, 2, 3, 4, 5],true],
    [8,[1, 4, 4, 2, 5],true],
    [12,[4, 4, 2, 4, 5],true],
    [16,[4, 4, 2, 4, 4],true],
    [20,[4, 4, 4, 4, 4],true],
    [8, [1, 2, 3, 4, 5], false],
    [-8, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["four", [1, 2, 1, 1, 1], false]
  ],
  "five":[
    [0,[1, 2, 3, 4, 6],true],
    [5,[1, 2, 3, 4, 5],true],
    [10,[1, 5, 3, 2, 5],true],
    [15,[1, 5, 5, 2, 5],true],
    [20,[5, 5, 5, 5, 1],true],
    [25,[5, 5, 5, 5, 5],true],
    [10, [1, 2, 3, 4, 5], false],
    [-10, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["five", [1, 2, 1, 5, 1], false]
  ],
  "six":[
    [0,[5, 5, 4, 3, 2],true],
    [6,[1, 2, 6, 4, 5],true],
    [12,[1, 6, 3, 6, 5],true],
    [18,[1, 2, 6, 6, 6],true],
    [24,[6, 6, 6, 2, 6],true],
    [30,[6, 6, 6, 6, 6],true],
    [6, [1, 2, 3, 4, 5], false],
    [-6, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["six", [1, 2, 6, 1, 1], false]
  ]
}

describe('Category Input Validations - Upper', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();

  })

  afterEach(async () => {
    await page.close()
  })

  afterAll(async () => {
    await browser.close()
  })
  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
  })

  describe(`Upper Validation: one`, () => {
    let category_id="one";
    let cat_tests = tests[category_id];
    for(let test of cat_tests){
       let newDice = test[1];
       let score = test[0];
       let expectedResult = test[2];
      it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
         await tools.enterCategory(page, newDice, category_id, score);
         let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled;`);
         expect(isDisabled).toBe(expectedResult);
       });
     }
   });//one

   describe(`Upper Validation: two`, () => {
     let category_id="two";
     let cat_tests = tests[category_id];
     for(let test of cat_tests){
        let newDice = test[1];
        let score = test[0];
        let expectedResult = test[2];
       it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
          await tools.enterCategory(page, newDice, category_id, score);
          let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled;`);
          expect(isDisabled).toBe(expectedResult);
        });
      }
    });//two

    describe(`Upper Validation: three`, () => {
      let category_id="three";
      let cat_tests = tests[category_id];
      for(let test of cat_tests){
         let newDice = test[1];
         let score = test[0];
         let expectedResult = test[2];
        it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
           await tools.enterCategory(page, newDice, category_id, score);
           let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled;`);
           expect(isDisabled).toBe(expectedResult);
         });
       }
     });

     describe(`Upper Validation: four`, () => {
       let category_id="four";
       let cat_tests = tests[category_id];
       for(let test of cat_tests){
          let newDice = test[1];
          let score = test[0];
          let expectedResult = test[2];
         it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
            await tools.enterCategory(page, newDice, category_id, score);
            let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled;`);
            expect(isDisabled).toBe(expectedResult);
          });
        }
      });//four

      describe(`Upper Validation: five`, () => {
        let category_id="five";
        let cat_tests = tests[category_id];
        for(let test of cat_tests){
           let newDice = test[1];
           let score = test[0];
           let expectedResult = test[2];
          it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
             await tools.enterCategory(page, newDice, category_id, score);
             let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled;`);
             expect(isDisabled).toBe(expectedResult);
           });
         }
       });//five

       describe(`Upper Validation: six`, () => {
         let category_id="six";
         let cat_tests = tests[category_id];
         for(let test of cat_tests){
            let newDice = test[1];
            let score = test[0];
            let expectedResult = test[2];
           it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
              await tools.enterCategory(page, newDice, category_id, score);
              let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled;`);
              expect(isDisabled).toBe(expectedResult);
            });
          }
        });//six

});//Upper Validation
