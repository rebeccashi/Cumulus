import express from "express";
import fs from "fs";
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

/*
  { "query": "software engineering internship new york" }
*/
app.get("/api/search", (req, res) => {
  if (!req.query.q) {
    res.status(406).send("Missing data");
    return;
  }

  var results = '{"autocomplete": "", "results": []}';

  async function search() {
    try {
      //connect to mongo
      await client.connect();

      var jsonObj = JSON.parse(results);

      //grab results
      var cursor = client
        .db("jobs")
        .collection("companies")
        .find({
          name: { $regex: req.query.q },
        });

      const companies = await cursor.toArray();
      //loop through results
      if (companies.length > 0) {
        companies.forEach((result, i) => {
          var listings = 0;
          //add up total listings
          for (var i = 0; i < result.copies[0].skills.length; i++) {
            //.replace gets ride of seperators between the thousands i.e 1,234 -> 1234
            listings =
              listings +
              Number(result.copies[0].skills[i].numJobs.replace(",", ""));
          }

          company = {
            _id: result._id,
            name: result.name,
            category: "Company",
            listings: listings,
          };
          //adds results to jsonObj
          jsonObj["results"].push(company);
        });
      }

      cursor = client
        .db("jobs")
        .collection("skills")
        .find({
          name: { $regex: req.query.q },
        });
      const skills = await cursor.toArray();

      if (skills.length > 0) {
        skills.forEach((result, i) => {
          skill = {
            _id: result._id,
            name: result.name,
            category: "Skill",
            listings: result.copies[0].numJobs,
          };

          jsonObj["results"].push(skill);
        });
      }

      cursor = client
        .db("jobs")
        .collection("titles")
        .find({
          name: { $regex: req.query.q },
        });

      const titles = await cursor.toArray();

      if (titles.length > 0) {
        titles.forEach((result, i) => {
          var listings = 0;

          for (var i = 0; i < result.copies[0].skills.length; i++) {
            listings =
              listings +
              Number(result.copies[0].skills[i].numJobs.replace(",", ""));
          }

          title = {
            _id: result._id,
            name: result.name,
            category: "Title",
            listings: listings,
          };

          jsonObj["results"].push(title);
        });
        results = JSON.stringify(jsonObj);
      }
    } catch (error) {
      console.log(error);
    }

    return results;
  }

  search().then((results) => res.stauts(200).send(results));
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
