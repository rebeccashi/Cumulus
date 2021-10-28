const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.use('/website', express.static(process.cwd() + '/'));
app.use('/', express.static(process.cwd() + '/'));
app.use('/search', express.static(process.cwd() + '/'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`listening on ${process.env.PORT || 5000}`);
});