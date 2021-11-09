import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@jobs.tcmdh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const COLLECTIONS = {
  SKILLS: "skills",
  TITLES: "titles",
  COMPANIES: "companies"
};

const populateParsedSkills = async (queryObject) => {
  await client.connect();

  const db = client.db(queryObject.outputDb);
  const skills = db.collection(COLLECTIONS.SKILLS);

  const query = { copies: { $elemMatch: { date: queryObject.date } } };

  console.log("Reading from MongoDB...");
  const cursor = skills.find(query, {});
  console.log("Read successful! Adding existing skills to skip list...");

  const totalLength = await cursor.count();
  let current = 0;

  await cursor.forEach((skill) => {
    process.stdout.write(`Adding skill ${current++}/${totalLength}\r`);
    queryObject.skillIdMap.set(skill.name, skill._id);
    queryObject.parsedSkills.set(skill.name, 1);
  });
  process.stdout.write("\n");

  await client.close();
};

const getAllSkills = async (queryObject) => {
  await client.connect();

  const db = client.db(queryObject.outputDb);
  const skills = db.collection(COLLECTIONS.SKILLS);
}

const writeSkill = async (queryObject, skill) => {
  const name = skill.name;
  delete skill.name;

  await client.connect();

  const db = client.db(queryObject.outputDb);
  const skills = db.collection(COLLECTIONS.SKILLS);

  const query = { name: name };

  const data = await skills.findOne(query, { name: 1, copies: 1 });

  if (data) {
    data.copies.unshift(skill);

    await skills.replaceOne(query, data);

    console.log(`Updated skill ${name}!`);
  } else {
    await skills.insertOne({
      name,
      copies: [skill],
    });

    console.log(`Wrote new skill ${name}!`);
  }
};

export { populateParsedSkills, writeSkill };
