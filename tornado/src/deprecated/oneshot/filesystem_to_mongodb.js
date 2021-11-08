import { MongoClient } from "mongodb";
import fs from "fs";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@jobs.tcmdh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbName = "jobs";

const run = async () => {
  try {
    console.log("Trying to connect to server...");
    await client.connect();
    console.log("Connected correctly to server!");

    const db = client.db(dbName);
    const col = db.collection("skills");

    console.log("Trying to read skills...");
    const files = fs.readdirSync(`./db/skills`);
    console.log("Read successful! Reading skills to memory...");

    const totalLength = files.length;
    const skillArray = [];
    for (let i = 0; i < totalLength; i++) {
      const data = JSON.parse(
        fs.readFileSync(`./db/skills/${files[i]}`, "utf-8")
      );
      skillArray.push(data);
      process.stdout.write(`Adding skill ${i}/${totalLength} to memory\r`);
    }
    process.stdout.write("\n");

    console.log("Read skills to memory! Uploading skills to MongoDB...");
    const p = await col.insertMany(skillArray);
    console.log("Uploaded skills to MongoDB!");
  } catch (err) {
    console.log(err.stack);
  }
};

run().catch(console.dir);
client.close();
