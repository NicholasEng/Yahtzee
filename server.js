const express = require('express');

const app = express();
const port = 3000;

app.use(express.static('static')); //greenlights all requests for files in the static folder

app.listen(port, () => {
  console.log(`Yahtzee server listening at http://localhost:${port}`)
});
