const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// pretend reading from file system is like a database lol
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
  let arrayJobs = new Array(10);
  let index = 0;

  Object.keys(keywordsObj).forEach(l => {
    arrayJobs[index] = { language: l, count: keywordsObj[l] };
    currAmt += keywordsObj[l];
    index++;
  })

  let sortedKeywords = arrayJobs.sort((a,b) => b.count - a.count);

  let top10 = sortedKeywords.slice(0, 10);

  let withPercentages = top10.map(el => { el.percent = (el.count / currAmt).toFixed(5); return el; });

  res.send(withPercentages.filter(el => (el !== null && el.count > 0)))
});

/*
  { "query": "software engineering internship new york" }
*/
app.get('/api/companies', (req, res) => {
  if (!req.query.q) {
    res.status(406).send('Missing data');
    return;
  }

  let companies = new Array(20);
  let companyObj = {};
  let index = 0;
  
  jobDb.forEach((obj) => {
    let company = obj.company;

    if (obj.title.toLowerCase().indexOf(req.query.q.trim().toLowerCase()) < 0) return;
    
    if (!companyObj[company]) {
      companyObj[company] = 1;
    } else {
      companyObj[company]++;
    }
  });

  Object.keys(companyObj).forEach(l => {
    companies[index] = { company: l, count: companyObj[l] };
    index++;
  });

  let sortedCompanies = companies.sort((a,b) => b.count - a.count);

  let top20 = sortedCompanies.slice(0, 20);

  res.send(top20.filter(el => (el !== null && el.count > 0)))
});

/*
  { "query": "software engineering internship new york" }
*/
app.get('/api/majors', (req, res) => {
  if (!req.query.q) {
    res.status(406).send('Missing data');
    return;
  }

  // if we had a search it would go here
  let foundJobs = jobDb.filter(job => job.title.toLowerCase().indexOf(req.query.q.trim().toLowerCase()) >= 0); // fix this

  let majorsObj = {};

  foundJobs.forEach(job => {
    Object.keys(job.majors).forEach(major => {
      if (!majorsObj[major]) majorsObj[major] = job.majors[major];
      else majorsObj[major] += job.majors[major];
    });
  });

  let currAmt = 0;
  let arrayMajors = new Array(10);
  let index = 0;

  Object.keys(majorsObj).forEach(l => {
    arrayMajors[index] = { major: l, count: majorsObj[l] };
    currAmt += majorsObj[l];
    index++;
  })

  let sortedKeywords = arrayMajors.sort((a,b) => b.count - a.count);

  let top10 = sortedKeywords.slice(0, 10);

  let withPercentages = top10.map(el => { el.percent = (el.count / currAmt).toFixed(5); return el; });

  res.send(top10.filter(el => (el !== null && el.count > 0)))
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT || 3000}`);
});