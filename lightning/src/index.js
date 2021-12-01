import express from "express";
import cors from "cors";
const app = express();
import { MongoClient, ObjectId } from "mongodb";

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

  const response = { results: [] };

  async function search() {
    try {
      // connect to mongo
      await client.connect();

      // company results
      const db = client.db(DATABASE);
      const companies = db.collection(COLLECTIONS.COMPANIES);

      const query = { name: { $regex: req.query.q, $options: "i" } };

      let cursor = companies.find(query, {}).limit(100);

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

      cursor = skills.find(query, {}).limit(100);

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

      cursor = titles.find(query, {}).limit(100);

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
  if (!req.query.name) {
    res.status(406).send("Missing data");
    return;
  }

  async function search() {
    try {
      // connect to mongo
      await client.connect();

      // company results
      const db = client.db(DATABASE);
      const companies = db.collection(COLLECTIONS.COMPANIES);

      let query = { name: req.query.name };

      let data = await companies.findOne(query, {});

      if (data) {
        return {
          _id: data._id,
          name: data.name,
          category: "Company",
          listings: data.copies.map((copy) => {
            return {
              date: copy.date,
              listings: copy.skills.reduce(
                (acc, curr) => acc + parseInt(curr.numJobs.replace(/,/g, "")),
                0
              ),
            };
          }),
          data:
            data.copies.length > 0
              ? data.copies[0].skills
                  .map((skill) => {
                    return {
                      name: skill.name,
                      category: "Skill",
                      listings: parseInt(skill.numJobs.replace(/,/g, "")),
                    };
                  })
                  .sort((a, b) => b.listings - a.listings)
              : [],
        };
      }

      // skill results
      const skills = db.collection(COLLECTIONS.SKILLS);

      data = await skills.findOne(query, {});

      let subData = [];

      if (data.copies.length > 0) {
        data.copies[0].titles.forEach((title) => {
          subData.push({
            name: title.name,
            category: "Title",
            listings: parseInt(title.numJobs.replace(/,/g, "")),
          });
        });

        data.copies[0].companies.forEach((company) => {
          subData.push({
            name: company.name,
            category: "Company",
            listings: parseInt(company.numJobs.replace(/,/g, "")),
          });
        });
      }

      if (data) {
        return {
          _id: data._id,
          name: data.name,
          category: "Skill",
          listings: data.copies.map((copy) => {
            return {
              date: copy.date,
              listings: copy.numJobs.replace(/,/g, ""),
            };
          }),
          data: subData.sort((a, b) => b.listings - a.listings),
        };
      }

      // titles results
      const titles = db.collection(COLLECTIONS.TITLES);

      data = await titles.findOne(query, {});

      if (data) {
        return {
          _id: data._id,
          name: data.name,
          category: "Title",
          listings: data.copies.map((copy) => {
            return {
              date: copy.date,
              listings: copy.skills.reduce(
                (acc, curr) => acc + parseInt(curr.numJobs.replace(/,/g, "")),
                0
              ),
            };
          }),
          data:
            data.copies.length > 0
              ? data.copies[0].skills
                  .map((skill) => {
                    return {
                      name: skill.name,
                      category: "Skill",
                      listings: parseInt(skill.numJobs.replace(/,/g, "")),
                    };
                  })
                  .sort((a, b) => b.listings - a.listings)
              : [],
        };
      }
    } catch (error) {
      console.log(error);
    }

    return {};
  }

  search().then((results) => res.status(200).send(results));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on ${process.env.PORT || 3000}`);
});
