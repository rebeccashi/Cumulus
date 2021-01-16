const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const jobDb = JSON.parse(fs.readFileSync("jobData.json", 'utf-8'));
const keywords = JSON.parse(fs.readFileSync("languagesData.json", 'utf-8'));

const keywordDb = [];

let amt = 0;

Object.keys(keywords).forEach(l => {
  keywordDb.push({ language: l, count: keywords[l] });
  amt += keywords[l];
})

app.use('/website', express.static(__dirname + '/website'));
app.use('/', express.static(__dirname + '/website'));


/*
  { "query": "software engineering internship new york" }
*/
app.get('/api/keywords', (req, res) => {
  if (!req.query.q) {
    res.status(406).send('Missing data');
    return;
  }

  // if we had a search it would go here
  let foundJobs = jobDb.filter(job => job.title.toLowerCase().indexOf(req.query.q.trim().toLowerCase()) >= 0); // fix this

  let keywordsObj = {};

  foundJobs.forEach(job => {
    Object.keys(job.keywords).forEach(keyword => {
      if (!keywordsObj[keyword]) keywordsObj[keyword] = job.keywords[keyword];
      else keywordsObj[keyword] += job.keywords[keyword];
    });
  });

  let currAmt = 0;
  let arrayJobs = [];

  Object.keys(keywordsObj).forEach(l => {
    arrayJobs.push({ language: l, count: keywordsObj[l] });
    currAmt += keywordsObj[l];
  })

  let sortedKeywords = arrayJobs.sort((a,b) => b.count - a.count);

  let top10 = sortedKeywords.slice(0, 10);

  let withPercentages = top10.map(el => { el.percent = (el.count / currAmt).toFixed(5); return el; });

  res.send(withPercentages)
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT || 3000}`);
});