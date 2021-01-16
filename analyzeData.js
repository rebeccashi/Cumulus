const fs = require('fs');

let text = fs.readFileSync("descriptions.json").toString('utf-8');

let textobj = JSON.parse(text);
let jobDataObj =  JSON.parse(fs.readFileSync("jobData.json").toString('utf-8'))

const programmingLanguages = ['Bash', 'C', 'C++', "C#", "CSS", 'Dreamweaver', 'Kotlin',  "Go", 'Golang',  'HTML', "Javascript", "Java", "Node" , "MySQL", "Objective-C", 'python', 'PERL', 'php', 'qt', 'sql', 'R', 'ruby', 'Ruby on Rails', 'Scala', 'Smalltalk', 'mySQL', 'postgres', 'postgresql', 'graphql', 'mongodb', 'Swift', 'jQuery', 'Matlab', 'React', 'aws', 'typescript', ];
const languagesData = {};
const jobData = [];

programmingLanguages.map((language) => {
  languagesData[language] = 0;
})

//C: case sensitive

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const findTopLanguages = () => {
  textobj.forEach(job => {
    let langs = {};
  
    programmingLanguages.forEach((language, i) => {
      let regex = new RegExp(`(?:\\s|\\W|>)(${escapeRegExp(language)})(?:\\s|\\W|<)`, 'gmi');
    
      if (language === 'C') regex = new RegExp(`(?:\\s|\\W|>)(C)(?:\\s|,|\\\\.|\\/|&|<)`, 'gmi');
  
      let matches = job.description.match(regex);
    
      langs[language] = matches ? matches.length : 0;
      languagesData[language] += matches ? matches.length : 0;
    });
  
    job.keywords = langs;
  
    jobData.push(job);
  })
  fs.writeFileSync('languagesData.json', JSON.stringify(languagesData));
  fs.writeFileSync('jobData.json', JSON.stringify(jobData));
}

const findTopCompanies = () => {
  let companies = [];
  let companyMap = new Map();
  let companyData;
  
  jobDataObj.forEach((obj) => {
    const company = obj.company;
    // console.log(`company: ${company}, id: ${obj.id}`)
    if (!companyMap.has(company)) {
      companyMap.set(company, 1)
    } else {
      companyMap.set(company, companyMap.get(company)+1)
    }
    companies.push(obj.company)
  })
  companyData = transformMapIntoData(companyMap);
  console.log(companyData)
  fs.writeFileSync('companyData.json', JSON.stringify(companyData));
}

const transformMapIntoData = (map) => {
  let data = {};
  for (let [key, value] of map) {
    data[key] = value
  }
  return data
}

const findTopmajors = () => {
  const majors = ["computer science", "computer engineering",  "information technology", "statistics", "data analytics", "data science",
"computer information systems", "electrical engineering", "mechanical engineering", "industrial engineering", "biomedical engineering", "chemistry", 
"business analytics", "mathematics", "physics", "material science Engineering"]
  // Computer Engineering/Science
  // Computer Science or Engineering

findTopCompanies();

