import fs from "fs";

import { uuid } from './util.js';

const populateParsedSkills = (queryObject) => {
  try {
    console.log("Checking if output directory exists...");
    const files = fs.readdirSync(`${queryObject.outputDb}/skills`);
    console.log("It exists, adding existing skills to skip list!");

    const totalLength = files.length;

    files.forEach((file, index) => {
      const data = JSON.parse(fs.readFileSync(`${queryObject.outputDb}/skills/${file}`, 'utf-8'));
      process.stdout.write(`Adding skill ${index}/${totalLength}\r`);
      queryObject.skillIdMap.set(data.name, file);
      if (!data.copies.some(copy => copy.date === queryObject.date))
        queryObject.parsedSkills.set(data.name, 1)
    });
    process.stdout.write('\n');
  } catch (err) {
    console.log("It does not exist! Creating it now...");
    fs.mkdirSync(queryObject.outputDb);
    console.log("Created it successfully!");
  }
}

const writeSkill = (queryObject, skill) => {
  const name = skill.name;
  delete skill.name;

  if (queryObject.skillIdMap.has(name)) {
    const file = queryObject.skillIdMap.get(name);
    const data = JSON.parse(fs.readFileSync(`${queryObject.outputDb}/${file}`, 'utf-8'));

    data.copies.unshift(skill);
    fs.writeFileSync(
      `${queryObject.outputDb}/skills/${file}`,
      JSON.stringify(skill)
    );
    
    console.log(`Updated skill ${name} at file ${file}!`);
  } else {
    const file = uuid(50);

    fs.writeFileSync(
      `${queryObject.outputDb}/skills/${file}`,
      JSON.stringify({
        name,
        copies: [
          skill
        ]
      })
    );

    console.log(`Wrote new skill ${name} at file ${file}`);
  }
}

export { populateParsedSkills, writeSkill };