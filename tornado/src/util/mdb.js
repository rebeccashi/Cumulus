import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@jobs.tcmdh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const COLLECTIONS = {
  SKILLS: "skills",
  TITLES: "titles",
  COMPANIES: "companies",
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

const getAllCurrentSkills = async (queryObject) => {
  await client.connect();

  const db = client.db(queryObject.outputDb);
  const skills = db.collection(COLLECTIONS.SKILLS);

  const query = { copies: { $elemMatch: { date: queryObject.date } } };

  console.log("Reading from MongoDB...");
  const cursor = skills.find(query, {});
  console.log("Read successful! Adding skills to skills array...");

  const totalLength = await cursor.count();
  let current = 0;

  await cursor.forEach((skill) => {
    process.stdout.write(`Adding skill ${current++}/${totalLength}\r`);
    queryObject.skillArray.push(skill);
  });
  process.stdout.write("\n");

  await client.close();
};

const writeCompany = async (queryObject, company) => {
  const name = company.name;
  delete company.name;

  await client.connect();

  const db = client.db(queryObject.outputDb);
  const companies = db.collection(COLLECTIONS.COMPANIES);

  const query = { name: name };

  const data = await companies.findOne(query, { name: 1, copies: 1 });

  if (data) {
    if (!data.copies.some((copy) => copy.date == queryObject.date)) {
      data.copies.unshift(company);

      await companies.replaceOne(query, data);

      console.log(`Updated company ${name}!`);
    }
  } else {
    await companies.insertOne({
      name,
      copies: [company],
    });

    console.log(`Wrote new company ${name}!`);
  }

  await client.close();
};

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

  await client.close();
};

const writeTitle = async (queryObject, title) => {
  const name = title.name;
  delete title.name;

  await client.connect();

  const db = client.db(queryObject.outputDb);
  const titles = db.collection(COLLECTIONS.TITLES);

  const query = { name: name };

  const data = await titles.findOne(query, { name: 1, copies: 1 });

  if (data) {
    if (!data.copies.some((copy) => copy.date == queryObject.date)) {
      data.copies.unshift(title);

      await skiltitles.replaceOne(query, data);

      console.log(`Updated title ${name}!`);
    }
  } else {
    await titles.insertOne({
      name,
      copies: [title],
    });

    console.log(`Wrote new title ${name}!`);
  }

  await client.close();
};

export {
  getAllCurrentSkills,
  populateParsedSkills,
  writeCompany,
  writeSkill,
  writeTitle,
};
