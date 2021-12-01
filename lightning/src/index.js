import express from "express";
import cors from "cors";
const app = express();
import { MongoClient } from "mongodb";

import dotenv from "dotenv";
dotenv.config();

app.use(express.json());
app.use(cors());

//MongoDB connection string
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@jobs.tcmdh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const DATABASE = "jobs";
const COLLECTIONS = {
  SKILLS: "skills",
  TITLES: "titles",
  COMPANIES: "companies",
};

/*
  { "query": "software engineering internship new york" }
*/
app.get("/api/search", (req, res) => {
  if (!req.query.q) {
    res.status(406).send("Missing data");
    return;
  }

  var response = { results: [] };

  async function search() {
    try {
      // connect to mongo
      await client.connect();

      // company results
      const db = client.db(DATABASE);
      const companies = db.collection(COLLECTIONS.COMPANIES);

      let query = { name: { $regex: req.query.q, $options: "i" } };

      let cursor = companies.find(query, {});

      await cursor.forEach((company) => {
        response.results.push({
          _id: company._id,
          name: company.name,
          category: "Company",
          listings:
            company.copies.length > 0
              ? company.copies[0].skills.reduce(
                  (acc, curr) => acc + parseInt(curr.numJobs.replace(/,/g, "")),
                  10
                )
              : 0,
        });
      });

      // skill results
      const skills = db.collection(COLLECTIONS.SKILLS);

      query = { name: { $regex: req.query.q, $options: "i" } };

      cursor = skills.find(query, {});

      await cursor.forEach((skill) => {
        response.results.push({
          _id: skill._id,
          name: skill.name,
          category: "Skill",
          listings: skill.copies.length > 0 ? skill.copies[0].numJobs : 0,
        });
      });

      // titles results
      const titles = db.collection(COLLECTIONS.TITLES);

      query = { name: { $regex: req.query.q, $options: "i" } };

      cursor = titles.find(query, {});

      await cursor.forEach((title) => {
        response.results.push({
          _id: title._id,
          name: title.name,
          category: "Title",
          listings:
            title.copies.length > 0
              ? title.copies[0].skills.reduce(
                  (acc, curr) => acc + parseInt(curr.numJobs.replace(/,/g, "")),
                  10
                )
              : 0,
        });
      });
    } catch (error) {
      console.log(error);
    }

    response.results = response.results.sort((a, b) => b.listings - a.listings);

    return response;
  }

  search().then((results) => res.status(200).send(results));
});

app.get("/api/overview", (req, res) => {
  if (!req.query.q) {
    res.status(406).send("Missing data");
    return;
  }

  var results = "{}";

  async function search() {
    try {
      //connect to mongo
      await client.connect();

      var jsonObj = JSON.parse(results);

      //grab results
      var cursor = client.db("jobs").collection("companies").find({
        _id: req.query.q,
      });
      const companies = await cursor.toArray();
      //go through array of results
      if (companies.length > 0) {
        companies.forEach((result, i) => {
          company = {
            _id: result._id,
            name: result.name,
            category: "Company",
            listings: result.copies,
          };
          //push company to jsonObj
          jsonObj.push(company);
        });
      }

      cursor = client.db("jobs").collection("skills").find({
        _id: req.query.q,
      });

      const skills = await cursor.toArray();

      if (skills.length > 0) {
        skills.forEach((result, i) => {
          skill = {
            _id: result._id,
            name: result.name,
            category: "Skill",
            listings: result.copies,
          };

          jsonObj.push(skill);
        });
      }

      cursor = client.db("jobs").collection("titles").find({
        _id: req.query.q,
      });

      const titles = await cursor.toArray();

      if (titles.length > 0) {
        titles.forEach((result, i) => {
          title = {
            _id: result._id,
            name: result.name,
            category: "Title",
            listings: result.copies,
          };

          jsonObj.push(title);
        });
      }
      results = JSON.stringify(jsonObj);
    } catch (error) {
      console.log(error);
    }
  }
  search().then((results) => res.stauts(200).send(results));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT || 3000}`);
});
