const puppeteer = require('puppeteer');
const tools = require('./utils');

describe('Dice', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterEach(async () => {
    await page.close()
  });

  afterAll(async () => {
    await browser.close()
  });

  describe('Roll Button', () => {
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
    });

    it('should roll dice and get different values', async () => {
      const rollButton = await page.$('#roll-dice')
      await rollButton.click();
      await tools.sleep(2100);
      const roll1 = await page.evaluate('window.myDice.getDiceArray();');
      await rollButton.click();
      await tools.sleep(2100);
      const roll2 = await page.evaluate('window.myDice.getDiceArray();');
      expect(roll1.toString()).not.toBe(roll2.toString());
      await rollButton.click();
      await tools.sleep(2100);
      const roll3 = await page.evaluate('window.myDice.getDiceArray();');
      expect(roll2.toString()).not.toBe(roll3.toString());
    });

  });

  describe('Reserving Dice ', () => {
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
    })

    it('should add .reserved on a double click', async () => {
      const rollButton = await page.$('#roll-dice')
      await rollButton.click();
      await tools.sleep(2100);

      for(let d = 0; d<5; d++){
        let die = await page.$('#die-'+d);
        let die_classList_before = await page.evaluate('Array.from(document.getElementById("die-'+d+'").classList)');
        expect(die_classList_before.indexOf("reserved")).toBe(-1);

        await die.click({
          clickCount: 2
        });

        let die_classList_after = await page.evaluate('Array.from(document.getElementById("die-'+d+'").classList)');
        expect(die_classList_after.indexOf("reserved")).toBeGreaterThan(-1);
      }//check all five dice
    });//'should reserve a die on a double click'

    it('should remove .reserved on a second double click', async () => {
      const rollButton = await page.$('#roll-dice')
      await rollButton.click();
      await tools.sleep(2100);

      for(let d = 0; d<5; d++){
        let die = await page.$('#die-'+d);
        await page.evaluate('document.getElementById("die-'+d+'").classList.add("reserved")');
        let die_classList_before = await page.evaluate('Array.from(document.getElementById("die-'+d+'").classList)');
        expect(die_classList_before.indexOf("reserved")).toBeGreaterThan(-1);

        await die.click({
          clickCount: 2
        });
        let die_classList_after = await page.evaluate('Array.from(document.getElementById("die-'+d+'").classList)');
        console.log("Insider RESERVER TEST: " + JSON.stringify(die_classList_after));

        expect(die_classList_after.indexOf("reserved")).toBe(-1);
      }//check all five dice
    });//'should unreserve a die on a second double click'

    it("shouldn't add .reserved for blank dice", async () => {

      for(let d = 0; d<5; d++){
        let die = await page.$('#die-'+d);
        let die_classList_before = await page.evaluate('Array.from(document.getElementById("die-'+d+'").classList)');
        expect(die_classList_before.indexOf("reserved")).toBe(-1);

        await die.click({
          clickCount: 2
        });

        let die_classList_after = await page.evaluate('Array.from(document.getElementById("die-'+d+'").classList)');
        expect(die_classList_after.indexOf("reserved")).toBe(-1);
      }//check all five dice
    });//"shouldn't reserve blank dice"

    it("shouldn't roll reserved dice", async () => {
      const rollButton = await page.$('#roll-dice')
      await rollButton.click();
      await tools.sleep(2100);
      //const preRoll = await tools.diceToArray(page);
      const preRoll = await page.evaluate('window.myDice.getDiceArray();')
      const die_1 = await page.$('#die-1');
      await die_1.click({
        clickCount: 2
      });
      const die_4 = await page.$('#die-4');
      await die_4.click({
        clickCount: 2
      });
      const die_2 = await page.$('#die-2');
      await die_2.click({
        clickCount: 2
      });
      await rollButton.click();
      await tools.sleep(2100);
    //  const postRoll = await tools.diceToArray(page);
      const postRoll = await page.evaluate('window.myDice.getDiceArray();')

      expect(postRoll[1]).toBe(preRoll[1]);
      expect(postRoll[4]).toBe(preRoll[4]);
      expect(postRoll[2]).toBe(preRoll[2]);
    });
  });

  describe('Roll Count', () => {
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
    })
    it("shouldn't roll more than three times per turn", async () => {
      const rollButton = await page.$('#roll-dice')
      await rollButton.click();
      await tools.sleep(2100);
      await rollButton.click();
      await tools.sleep(2100);
      await rollButton.click();
      await tools.sleep(2100);
      //const preRoll = await tools.diceToArray(page);
      const preRoll = await page.evaluate('window.myDice.getDiceArray();')
      await rollButton.click();
      await tools.sleep(2100);
      //const postRoll = await tools.diceToArray(page);
      const postRoll = await page.evaluate('window.myDice.getDiceArray();')
      expect(preRoll.toString()).toBe(postRoll.toString());
    });

    it('should decrease roll count by 1 after a roll', async () => {
      const rollButton = await page.$('#roll-dice')
      let rollsRemaining1 = await tools.getRollCount(page);
      await rollButton.click();
      await tools.sleep(2100);
      let rollsRemaining2 = await tools.getRollCount(page);
      expect(rollsRemaining2).toBe(rollsRemaining1 - 1);
      await rollButton.click();
      await tools.sleep(2100);
      let rollsRemaining3 = await tools.getRollCount(page);
      expect(rollsRemaining3).toBe(rollsRemaining1 - 2);
      await rollButton.click();
      await tools.sleep(2100);
      let rollsRemaining4 = await tools.getRollCount(page);
      expect(rollsRemaining4).toBe(rollsRemaining1 - 3);
    })

    it("shouldn't decrease roll count past 0", async () => {
      const rollButton = await page.$('#roll-dice')
      await rollButton.click();
      await tools.sleep(2100);
      await rollButton.click();
      await tools.sleep(2100);
      await rollButton.click();
      await tools.sleep(2100);
      await rollButton.click();
      await tools.sleep(2100);
      await rollButton.click();
      await tools.sleep(2100);
      let rollsRemaining = await tools.getRollCount(page);
      expect(rollsRemaining).toBe(0);
    })
  });

});
