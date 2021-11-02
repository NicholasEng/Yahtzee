const puppeteer = require('puppeteer');
const tools = require('./utils');



  describe('Scoring', () => {
    let browser;
    let page;

    beforeAll(async () => {
      browser = await puppeteer.launch()
    });

    afterEach(async () => {
      await page.close()
    });

    afterAll(async () => {
      await browser.close()
    });
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
    });
    it('should correctly calculate upper-total', async () => {
      await tools.enterCategory(page, [1,2,3,4,5], "one", 1);
      await tools.enterCategory(page, [1,2,3,4,5], "two", 2);
      await tools.enterCategory(page, [1,2,3,4,5], "three", 3);
      await tools.enterCategory(page, [1,2,3,4,5], "four", 4);
      await tools.enterCategory(page, [1,2,3,4,5], "five", 5);
      await tools.enterCategory(page, [1,2,6,6,5], "six", 12);
      const upperTotal = await page.evaluate('parseInt(document.getElementById("upper-total").innerHTML);');
      expect(upperTotal).toBe(27);
      const upperSectionTotal = await page.evaluate('parseInt(document.getElementById("upper-section-total").innerHTML);');
      expect(upperSectionTotal).toBe(27);
      const lowerUpperTotal = await page.evaluate('parseInt(document.getElementById("upper-section-total-lower").innerHTML);');
      expect(lowerUpperTotal).toBe(27);
    });

    it('should not apply upper section bonus for score === 63', async () => {
      await tools.enterCategory(page, [1,1,1,4,5], "one", 3);
      await tools.enterCategory(page, [1,2,3,2,2], "two", 6);
      await tools.enterCategory(page, [1,2,3,3,3], "three", 9);
      await tools.enterCategory(page, [4,2,4,4,5], "four", 12);
      await tools.enterCategory(page, [5,2,5,4,5], "five", 15);
      await tools.enterCategory(page, [1,2,6,6,6], "six", 18);
      const upperBonus = await page.evaluate('document.getElementById("upper-bonus").innerHTML;');
      expect(upperBonus).toBe("");
    });

    it('should apply upper section bonus for score > 63', async () => {
      await tools.enterCategory(page, [1,1,1,1,5], "one", 4);
      await tools.enterCategory(page, [1,2,3,2,2], "two", 6);
      await tools.enterCategory(page, [1,2,3,3,3], "three", 9);
      await tools.enterCategory(page, [4,2,4,4,5], "four", 12);
      await tools.enterCategory(page, [5,2,5,4,5], "five", 15);
      await tools.enterCategory(page, [1,2,6,6,6], "six", 18);
      const upperBonus = await page.evaluate('document.getElementById("upper-bonus").innerHTML;');
      expect(upperBonus).toBe("35");
      const upperTotal = await page.evaluate('document.getElementById("upper-section-total").innerHTML;');
      expect(upperTotal).toBe("99");
    });

    it('should not apply upper section bonus for score < 63', async () => {
      await tools.enterCategory(page, [1,2,3,4,5], "one", 1);
      await tools.enterCategory(page, [1,2,3,4,5], "two", 2);
      await tools.enterCategory(page, [1,2,3,4,5], "three", 3);
      await tools.enterCategory(page, [1,2,3,4,5], "four", 4);
      await tools.enterCategory(page, [1,2,3,4,5], "five", 5);
      await tools.enterCategory(page, [1,2,6,6,5], "six", 12);
      const upperBonus = await page.evaluate('document.getElementById("upper-bonus").innerHTML;');
      expect(upperBonus).toBe("");
    });

    it('should correctly calculate lower-total', async () => {
      await tools.enterCategory(page, [5,5,5,5,5], "Yahtzee", 50);
      await tools.enterCategory(page, [1,2,3,4,5], "chance", 15);
      await tools.enterCategory(page, [2,2,3,3,3], "full-house", 25);
      const lowerTotal = await page.evaluate('document.getElementById("lower-total").innerHTML;');
      expect(parseInt(lowerTotal)).toBe(90);
    });

    it('should correctly calculate grand-total with a bonus', async () => {
      await tools.enterCategory(page, [1,1,1,1,5], "one", 4);
      await tools.enterCategory(page, [1,2,3,2,2], "two", 6);
      await tools.enterCategory(page, [1,2,3,3,3], "three", 9);
      await tools.enterCategory(page, [4,2,4,4,5], "four", 12);
      await tools.enterCategory(page, [5,2,5,4,5], "five", 15);
      await tools.enterCategory(page, [1,2,6,6,6], "six", 18);
      await tools.enterCategory(page, [5,5,5,5,5], "Yahtzee", 50);
      await tools.enterCategory(page, [1,2,3,4,5], "chance", 15);
      await tools.enterCategory(page, [2,2,3,3,3], "full-house", 25);
      const upperTotal = await page.evaluate('parseInt(document.getElementById("upper-total").innerHTML);');
      expect(parseInt(upperTotal)).toBe(64);
      const upperBonus = await page.evaluate('document.getElementById("upper-bonus").innerHTML;');
      expect(upperBonus).toBe("35");
      const upperFullTotal = await page.evaluate('document.getElementById("upper-section-total").innerHTML;');
      expect(parseInt(upperFullTotal)).toBe(99);
      const lowerTotal = await page.evaluate('document.getElementById("lower-total").innerHTML;');
      expect(parseInt(lowerTotal)).toBe(90);
      const lowerUpperTotal = await page.evaluate('document.getElementById("upper-section-total-lower").innerHTML;');
      expect(parseInt(lowerUpperTotal)).toBe(99);
      const grandTotal = await page.evaluate('document.getElementById("grand-total").innerHTML;');
      expect(parseInt(grandTotal)).toBe(189);
    });

    it('should correctly calculate grand-total without a bonus', async () => {
      await tools.enterCategory(page, [1,1,1,2,5], "one", 3);
      await tools.enterCategory(page, [1,2,3,2,2], "two", 6);
      await tools.enterCategory(page, [1,2,3,3,3], "three", 9);
      await tools.enterCategory(page, [4,2,4,4,5], "four", 12);
      await tools.enterCategory(page, [5,2,5,4,5], "five", 15);
      await tools.enterCategory(page, [1,2,6,6,6], "six", 18);
      await tools.enterCategory(page, [5,5,5,5,5], "Yahtzee", 50);
      await tools.enterCategory(page, [1,2,3,4,5], "chance", 15);
      await tools.enterCategory(page, [2,2,3,3,3], "full-house", 25);
      const upperTotal = await page.evaluate('parseInt(document.getElementById("upper-total").innerHTML);');
      expect(parseInt(upperTotal)).toBe(63);
      const upperBonus = await page.evaluate('document.getElementById("upper-bonus").innerHTML;');
      expect(upperBonus).toBe("");
      const upperFullTotal = await page.evaluate('document.getElementById("upper-section-total").innerHTML;');
      expect(parseInt(upperFullTotal)).toBe(63);
      const lowerTotal = await page.evaluate('document.getElementById("lower-total").innerHTML;');
      expect(parseInt(lowerTotal)).toBe(90);
      const lowerUpperTotal = await page.evaluate('document.getElementById("upper-section-total-lower").innerHTML;');
      expect(parseInt(lowerUpperTotal)).toBe(63);
      const grandTotal = await page.evaluate('document.getElementById("grand-total").innerHTML;');
      expect(parseInt(grandTotal)).toBe(153);
    });

  });
