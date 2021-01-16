const express = require('express');
const app = express();

app.use('/website', express.static(__dirname + '/website'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT || 3000}`);
});