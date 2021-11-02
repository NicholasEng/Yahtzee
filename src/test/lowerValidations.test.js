const puppeteer = require('puppeteer');
const tools = require('./utils');

const tests={
  "3-of-a-kind":[
    [7,[1, 1, 1, 2, 2],true],
    [7,[1, 1, 2, 1, 2],true],
    [7,[1, 1, 2, 2, 1],true],
    [7,[1, 2, 1, 1, 2],true],
    [11,[1, 2, 1, 6, 1],true],
    [8,[2, 1, 1, 1, 3],true],
    [7,[2, 1, 1, 2, 1],true],
    [18,[4, 5, 3, 3, 3],true],
    [18,[4, 3, 5, 3, 3],true],
    [18,[3, 4, 5, 3, 3],true],
    [27,[6, 4, 6, 5, 6],true],
    [9,[2, 2, 2, 1, 2],true],
    [16,[3, 3, 4, 3, 3],true],
    [21,[4, 5, 4, 4, 4],true],
    [26,[6, 5, 5, 5, 5],true],
    [20,[4, 4, 4, 4, 4],true],
    [25,[5, 5, 5, 5, 5],true],
    [30,[6, 6, 6, 6, 6],true],
    [0,[2, 3, 4, 4, 5],true],
    [6, [1, 3, 3, 3, 5], false],
    [4, [1, 2, 1, 1, 1], false],
    [-3, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["four", [1, 2, 1, 1, 1], false]
  ],
  "4-of-a-kind":[
    [6,[1, 1, 1, 1, 2],true],
    [9,[2, 2, 2, 1, 2],true],
    [16,[3, 3, 4, 3, 3],true],
    [21,[4, 5, 4, 4, 4],true],
    [26,[6, 5, 5, 5, 5],true],
    [20,[4, 4, 4, 4, 4],true],
    [25,[5, 5, 5, 5, 5],true],
    [30,[6, 6, 6, 6, 6],true],
    [0,[4, 5, 5, 5, 6],true],
    [12, [1, 3, 3, 3, 3], false],
    [3, [1, 2, 1, 1, 1], false],
    [-3, [1, 2, 3, 4, 5], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["six", [1, 2, 1, 1, 1], false]
  ],
  "full-house":[
    [25,[1, 1, 1, 2, 2],true],
    [25,[1, 1, 2, 1, 2],true],
    [25,[1, 1, 2, 2, 1],true],
    [25,[1, 2, 1, 1, 2],true],
    [25,[1, 2, 1, 2, 1],true],
    [25,[3, 1, 1, 1, 3],true],
    [25,[2, 1, 1, 2, 1],true],
    [25,[5, 5, 3, 3, 3],true],
    [25,[5, 3, 5, 3, 3],true],
    [25,[3, 5, 5, 3, 3],true],
    [25,[6, 5, 6, 5, 6],true],
    [0,[3, 3, 3, 3, 3],true],
    [11, [1, 3, 3, 3, 1], false],
    [25, [1, 1, 1, 1, 1], false],
    [-25, [2, 2, 3, 3, 3], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["full-house", [1, 2, 2, 1, 1], false]
  ],
  "small-straight":[
    [30,[1, 2, 3, 4, 5],true],
    [30,[1, 2, 3, 4, 6],true],
    [30,[2, 3, 4, 5, 6],true],
    [30,[2, 2, 3, 4, 5],true],
    [30,[2, 3, 4, 5, 3],true],
    [30,[1, 2, 3, 4, 5],true],
    [30,[4, 3, 4, 5, 6],true],
    [30,[2, 3, 4, 3, 1],true],
    [30,[2, 3, 4, 6, 1],true],
    [0,[1, 2, 3, 5, 6],true],
    [30, [1, 3, 3, 3, 1], false],
    [25, [1, 2, 3, 4, 1], false],
    [-30, [2, 3, 4, 5, 6], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["small-straight", [1, 2, 3, 4, 1], false]
  ],
  "large-straight":[
    [40,[1, 2, 3, 4, 5],true],
    [40,[3, 2, 1, 4, 5],true],
    [40,[1, 4, 3, 5, 2],true],
    [40,[2, 3, 4, 5, 6],true],
    [40,[4, 5, 3, 2, 6],true],
    [40,[2, 5, 3, 4, 6],true],
    [0,[1, 2, 3, 4, 6],true],
    [40, [1, 3, 3, 3, 1], false],
    [30, [1, 2, 3, 4, 5], false],
    [-40, [2, 3, 4, 5, 6], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["large-straight", [1, 2, 3, 4, 5], false]
  ],
  "Yahtzee":[
    [50,[1, 1, 1, 1, 1],true],
    [50,[2, 2, 2, 2, 2],true],
    [50,[3, 3, 3, 3, 3],true],
    [50,[4, 4, 4, 4, 4],true],
    [50,[5, 5, 5, 5, 5],true],
    [50,[6, 6, 6, 6, 6],true],
    [0,[3, 3, 3, 4, 3],true],
    [50, [1, 3, 3, 3, 1], false],
    [25, [2, 2, 2, 2, 2], false],
    [-50, [4, 4, 4, 4, 4], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["yahtzee", [2, 2, 2, 2, 2], false]
  ],
  "chance":[
    [6,[1, 1, 1, 1, 2],true],
    [9,[2, 2, 2, 1, 2],true],
    [16,[3, 3, 4, 3, 3],true],
    [21,[4, 5, 4, 4, 4],true],
    [26,[6, 5, 5, 5, 5],true],
    [25, [5, 5, 5, 5, 4], false],
    ["", [1, 2, 3, 4, 5], false],
    [" ", [1, 2, 3, 4, 5], false],
    ["chance", [1, 2, 3, 4, 1], false]
  ]
}


describe('Category Input Validations - Lower', () => {
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

  describe(`Upper Validation: 3-of-a-kind`, () => {
    let category_id="3-of-a-kind";
     let cat_tests = tests[category_id];
      for(let test of cat_tests){
        let newDice = test[1];
        let score = test[0];
        let expectedResult = test[2];
        it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
           await tools.enterCategory(page, newDice, category_id, score);

           let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
           expect(isDisabled).toBe(expectedResult);
         });
     }
   });//3-of-a-kind
   describe(`Upper Validation: 4-of-a-kind`, () => {
     let category_id="4-of-a-kind";
      let cat_tests = tests[category_id];
       for(let test of cat_tests){
         let newDice = test[1];
         let score = test[0];
         let expectedResult = test[2];
         it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
            await tools.enterCategory(page, newDice, category_id, score);

            let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
            expect(isDisabled).toBe(expectedResult);
          });
      }
    });//4-of-a-kind
    describe(`Upper Validation: full-house`, () => {
      let category_id="full-house";
       let cat_tests = tests[category_id];
        for(let test of cat_tests){
          let newDice = test[1];
          let score = test[0];
          let expectedResult = test[2];
          it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
             await tools.enterCategory(page, newDice, category_id, score);

             let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
             expect(isDisabled).toBe(expectedResult);
           });
       }
     });//full_house
     describe(`Upper Validation: small-straight`, () => {
       let category_id="small-straight";
        let cat_tests = tests[category_id];
         for(let test of cat_tests){
           let newDice = test[1];
           let score = test[0];
           let expectedResult = test[2];
           it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
              await tools.enterCategory(page, newDice, category_id, score);

              let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
              expect(isDisabled).toBe(expectedResult);
            });
        }
      });//small-straight
      describe(`Upper Validation: large-straight`, () => {
        let category_id="large-straight";
         let cat_tests = tests[category_id];
          for(let test of cat_tests){
            let newDice = test[1];
            let score = test[0];
            let expectedResult = test[2];
            it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
               await tools.enterCategory(page, newDice, category_id, score);

               let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
               expect(isDisabled).toBe(expectedResult);
             });
         }
       });//large-straight
       describe(`Upper Validation: Yahtzee`, () => {
         let category_id="Yahtzee";
          let cat_tests = tests[category_id];
           for(let test of cat_tests){
             let newDice = test[1];
             let score = test[0];
             let expectedResult = test[2];
             it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
                await tools.enterCategory(page, newDice, category_id, score);

                let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
                expect(isDisabled).toBe(expectedResult);
              });
          }
        });//yahtzee
        describe(`Upper Validation: chance`, () => {
          let category_id="chance";
           let cat_tests = tests[category_id];
            for(let test of cat_tests){
              let newDice = test[1];
              let score = test[0];
              let expectedResult = test[2];
              it(`${score} for ${newDice} -> ${expectedResult}`, async() => {
                 await tools.enterCategory(page, newDice, category_id, score);

                 let isDisabled = await page.evaluate(`document.getElementById("${category_id}").disabled`);
                 expect(isDisabled).toBe(expectedResult);
               });
           }
         });//chance
});
