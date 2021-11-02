

async function enterCategory(page, diceArray, category_id, score) {
  await page.evaluate((diceArray, category_id, score) => {
    window.myDice.setDice(diceArray);
    document.getElementById("rolls-remaining").innerText=2;
    document.getElementById(category_id).value=score;
  }, diceArray, category_id, score);

  await page.focus(`input[id="${category_id}"]`);
  await page.keyboard.press("Enter");
}

async function getRollCount(page) {
  return await page.evaluate(() => {
    return parseInt(document.getElementById('rolls-remaining').innerText);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getRollCount = getRollCount;
exports.sleep = sleep;
exports.enterCategory = enterCategory;
