const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const {MongoClient} = require('mongodb');
const dotEnv = require('dotenv').config()
app.use(express.json());
app.use(cors());

//MongoDB connection string
const uri = "mongodb+srv://" + process.env.REACT_APP_MONGO_DB_ID + ":" + process.env.REACT_APP_MONGO_DB_SECRET + "@jobs.tcmdh.mongodb.net/jobs?retryWrites=true&w=majority"
const client = new MongoClient(uri);

// pretend reading from file system is like a database lol
const jobDb = JSON.parse(fs.readFileSync("../droplets/input/json/jobData.json", 'utf-8'));
const keywords = JSON.parse(fs.readFileSync("../droplets/output/json/languagesData.json", 'utf-8'));

const keywordDb = [];

let amt = 0;

Object.keys(keywords).forEach(l => {
  keywordDb.push({ language: l, count: keywords[l] });
  amt += keywords[l];
})







  











/*
  { "query": "software engineering internship new york" }
*/
app.get('/api/search', (req, res) => {
  if (!req.query.q) {
    res.status(406).send('Missing data');
    return;
  }

  var results = '{"autocomplete": "", "results": []}'


 async function search() {
    try{

      //connect to mongo
      await client.connect();

      var jsonObj = JSON.parse(results);

      //grab results 
  var cursor = client.db("jobs").collection("companies").find({
    "name" : { $regex: req.query.q}
  });

  const companies = await cursor.toArray();
  //loop through results
  if(companies.length > 0 ){
    companies.forEach((result, i) => {

      var listings = 0;
      //add up total listings
      for(var i = 0; i < result.copies[0].skills.length; i++){
        //.replace gets ride of seperators between the thousands i.e 1,234 -> 1234
      listings = listings + Number(result.copies[0].skills[i].numJobs.replace(',', ''));      
    }

      company = {
        "_id": result._id,
        "name": result.name,
        "category": "Company",
        "listings": listings

      }
      //adds results to jsonObj
      jsonObj['results'].push(company);
    });
  }


     cursor = client.db("jobs").collection("skills").find({
      "name" : {$regex: req.query.q}
    });
    const skills = await cursor.toArray();

    
    if(skills.length > 0 ){
      skills.forEach((result, i) => {

        skill = {
          "_id" : result._id,
          "name": result.name,
          "category": "Skill",
          "listings": result.copies[0].numJobs
        }

        jsonObj["results"].push(skill);
      });
     }

     cursor = client.db("jobs").collection("titles").find({
      "name" :{$regex: req.query.q}
     });

     const titles = await cursor.toArray();

     if(titles.length > 0 ){
      titles.forEach((result, i ) =>{

        var listings = 0;

        for(var  i = 0; i < result.copies[0].skills.length; i ++){
          listings = listings + Number(result.copies[0].skills[i].numJobs.replace(',', ''));      

        }

        title = {
          "_id": result._id,
          "name": result.name,
          "category": "Title",
          "listings": listings
        }

        jsonObj["results"].push(title);
      });
      results = JSON.stringify(jsonObj);
     }


 }

 catch (error){
  console.log(error);
 }

 return results;
  
}


  




search().then(results => res.stauts(200).send(results));
});


app.get('/api/overview', (req, res) => {
  if (!req.query.q) {
    res.status(406).send('Missing data');
    return;
  }

  var results = '{}';

  async function search(){
     try{

      //connect to mongo
      await client.connect();

      var jsonObj = JSON.parse(results);

      //grab results 
      var cursor = client.db("jobs").collection("companies").find({
        "_id": req.query.q
    });
     const companies = await cursor.toArray();
     //go through array of results
     if(companies.length > 0){
      companies.forEach((result, i) => {

        company = {
          "_id": result._id,
          "name": result.name,
          "category": "Company",
          "listings": result.copies
        }
        //push company to jsonObj
        jsonObj.push(company);

      });
     }

     cursor = client.db("jobs").collection("skills").find({
      "_id": req.query.q
     });

     const skills = await cursor.toArray();

     if(skills.length > 0){
      skills.forEach((result, i) => {

        skill = {
          "_id": result._id,
          "name": result.name,
          "category": "Skill",
          "listings": result.copies

        }

        jsonObj.push(skill);

      });
     }

     cursor = client.db('jobs').collection("titles").find({
      "_id": req.query.q
     });

     const titles = await cursor.toArray();

     if(titles.length > 0 ){
      titles.forEach((result, i ) =>{

        title = {
          "_id": result._id,
          "name": result.name,
          "category": "Title",
          "listings": result.copies
        }

        jsonObj.push(title);
      });
     }
      results = JSON.stringify(jsonObj);



    }

catch(error){
  console.log(error);
}


  }
search().then(results => res.stauts(200).send(results));
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

  res.send(withPercentages.filter(el => (el !== null && el.count > 0)))
});

/*
  { "query": "software engineering internship new york" }
*/
app.get('/api/types', (req, res) => {
  if (!req.query.q) {
    res.status(406).send('Missing data');
    return;
  }

  // if we had a search it would go here
  let foundJobs = jobDb.filter(job => job.title.toLowerCase().indexOf(req.query.q.trim().toLowerCase()) >= 0); // fix this

  let typesObj = {};

  foundJobs.forEach(job => {
    if (job.type) {
      job.type.forEach(type => {
        type = type.toLowerCase();

        if (type.indexOf(',') >= 0) {
          typeArr = type.split(',');
          typeArr.forEach(innertype => {
            innertype = innertype.trim();

            if (!typesObj[innertype]) typesObj[innertype] = 1;
            else typesObj[innertype]++;
          })
        } else {
          if (!typesObj[type]) typesObj[type] = 1;
          else typesObj[type]++;
        }
      });
    }
  });

  let arrayTypes = new Array(5);
  let index = 0;

  Object.keys(typesObj).forEach(l => {
    arrayTypes[index] = { type: l.charAt(0).toUpperCase() + l.substr(1), count: typesObj[l] };
    index++;
  })

  let sortedKeywords = arrayTypes.sort((a,b) => b.count - a.count);

  let top10 = sortedKeywords.slice(0, 10);

  res.send(top10.filter(el => (el !== null && el.count > 0)))
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT || 3000}`);
});