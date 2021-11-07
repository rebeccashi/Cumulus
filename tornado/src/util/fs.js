import fs from "fs";

const populateParsedSkills = (queryObject) => {
  try {
    console.log("Checking if output directory exists...");
    const files = fs.readdirSync(queryObject.outputDb);
    console.log("It exists, adding existing skills to skip list!");

    files.forEach((file) => queryObject.parsedSkills.set(file, 1));
  } catch (err) {
    console.log("It does not exist! Creating it now...");
    fs.mkdirSync(queryObject.outputDb);
    console.log("Created it successfully!");
  }
}

export { populateParsedSkills };