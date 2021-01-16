const fs = require('fs');

var text = fs.readFileSync("top1000descriptions-2").toString('utf-8');

const programmingLanguages = ['Bash', 'C', 'C++', "C#", "CSS", 'Dreamweaver', 'Kotlin',  "Go", 'Golang',  'HTML', "Javascript", "Java", "Node" , "MySQL", "Objective-C", 'python', 'PERL', 'php', 'qt', 'sql', 'R', 'ruby', 'Ruby on Rails', 'Scala', 'Smalltalk', 'mySQL', 'postgres', 'postgresql', 'graphql', 'mongodb', 'Swift', 'jQuery', 'Matlab', 'React', 'aws', 'typescript', ];
const languagesData = new Map();
// D

programmingLanguages.map((language) => {
  languagesData.set(language, 0);
})

//C: case sensitive

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

programmingLanguages.forEach((language, i) => {
  let regex = new RegExp(`(?:\\s|\\W|>)(${escapeRegExp(language)})(?:\\s|\\W|<)`, 'gmi');

  if (language === 'C') regex = new RegExp(`(?:\\s|\\W|>)(C)(?:\\s|,|\\\\.|\\/|&|<)`, 'gmi');

  console.log(text.match(regex));

  languagesData.set(language, text.match(regex)?.length);
})

console.log(languagesData)

