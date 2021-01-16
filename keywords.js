const fs = require('fs');

let text = fs.readFileSync("descriptions.json").toString('utf-8');

let textobj = JSON.parse(text);

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

// programmingLanguages.forEach((language, i) => {
//   let regex = new RegExp(`(?:\\s|\\W|>)(${escapeRegExp(language)})(?:\\s|\\W|<)`, 'gmi');

//   if (language === 'C') regex = new RegExp(`(?:\\s|\\W|>)(C)(?:\\s|,|\\\\.|\\/|&|<)`, 'gmi');

//   console.log(text.match(regex));

//   languagesData.set(language, text.match(regex)?.length);
// })

console.log(languagesData);

fs.writeFileSync('languagesData.json', JSON.stringify(languagesData));
fs.writeFileSync('jobData.json', JSON.stringify(jobData));