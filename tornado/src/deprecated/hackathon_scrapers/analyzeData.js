import fs from "fs";

let text = fs
  .readFileSync("../data/input/json/descriptions.json")
  .toString("utf-8");

let textobj = JSON.parse(text);
// let jobDataObj =  JSON.parse(fs.readFileSync("../data/input/json/jobData.json").toString('utf-8'))

const programmingLanguages = [
  "Bash",
  "C",
  "C++",
  "C#",
  "CSS",
  "Dreamweaver",
  "Kotlin",
  "Go",
  "Golang",
  "HTML",
  "JavaScript",
  "Java",
  "Node",
  "MySQL",
  "Objective-C",
  "Python",
  "Perl",
  "PHP",
  "Qt",
  "SQL",
  "R",
  "Ruby",
  "Ruby on Rails",
  "Scala",
  "Smalltalk",
  "Postgres",
  "PostgreSQL",
  "GraphQL",
  "MongoDB",
  "Swift",
  "jQuery",
  "Matlab",
  "React",
  "AWS",
  "TypeScript",
];
const majors = [
  "Computer Science",
  "Computer Engineering",
  "Information Technology",
  "Statistics",
  "Data Analytics",
  "Data Science",
  "Computer information Systems",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Industrial Engineering",
  "Biomedical Engineering",
  "Chemistry",
  "Business Analytics",
  "Mathematics",
  "Physics",
  "Material Science Engineering",
];
const languagesData = {};
const jobData = [];

programmingLanguages.map((language) => {
  languagesData[language] = 0;
});

//C: case sensitive

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const findTopLanguages = () => {
  textobj.forEach((job) => {
    let langs = {};
    let majorArr = {};

    programmingLanguages.forEach((language, i) => {
      let regex = new RegExp(
        `(?:\\s|\\W|>)(${escapeRegExp(language)})(?:\\s|\\W|<)`,
        "gmi"
      );

      if (language === "C")
        regex = new RegExp(`(?:\\s|\\W|>)(C)(?:\\s|,|\\\\.|\\/|&|<)`, "gmi");

      let matches = job.description.match(regex);

      langs[language] = matches ? matches.length : 0;
      languagesData[language] += matches ? matches.length : 0;
    });

    majors.forEach((major, i) => {
      let regex = new RegExp(
        `(?:\\s|\\W|>)(${escapeRegExp(major)})(?:\\s|\\W|<)`,
        "gmi"
      );

      let matches = job.description.match(regex);

      majorArr[major] = matches ? matches.length : 0;
    });

    job.keywords = langs;
    job.majors = majorArr;

    jobData.push(job);
  });
  // fs.writeFileSync('../data/output/json/languagesData.json', JSON.stringify(languagesData));
  fs.writeFileSync("../data/output/json/jobData.json", JSON.stringify(jobData));
};

const findTopCompanies = () => {
  let companies = [];
  let companyMap = new Map();
  let companyData;

  jobDataObj.forEach((obj) => {
    const company = obj.company;
    // console.log(`company: ${company}, id: ${obj.id}`)
    if (!companyMap.has(company)) {
      companyMap.set(company, 1);
    } else {
      companyMap.set(company, companyMap.get(company) + 1);
    }
    companies.push(obj.company);
  });
  companyData = transformMapIntoData(companyMap);
  // console.log(companyData)
  // fs.writeFileSync('../data/output/json/companyData.json', JSON.stringify(companyData));
};

const transformMapIntoData = (map) => {
  let data = {};
  for (let [key, value] of map) {
    data[key] = value;
  }
  return data;
};

const findTopmajors = () => {
  const majors = [
    "Computer science",
    "Computer engineering",
    "information Technology",
    "statistics",
    "data analytics",
    "data science",
    "Computer information systems",
    "electrical engineering",
    "mechanical engineering",
    "industrial engineering",
    "biomedical engineering",
    "chemistry",
    "business analytics",
    "mathematics",
    "physics",
    "material science Engineering",
  ];
  // Computer Engineering/Science
  // Computer Science or Engineering
};
findTopLanguages();
